using System; using System.IO; using System.Windows.Forms; using SBBridge.Core;
class FakeUsb : IControllerTransport { public byte[] Rep = new byte[26]; public bool IsOpen{get;set;} public string LastError{get{return null;}}
 public bool TryOpen(){IsOpen=true;return true;} public int Read(byte[] b,int t){System.Threading.Thread.Sleep(4);Buffer.BlockCopy(Rep,0,b,0,26);return 26;} public byte[] LastWrite; public bool Write(byte[] d){LastWrite=(byte[])d.Clone();return true;} public void Close(){IsOpen=false;} public void Dispose(){} }
class FakePad : IVirtualGamepad { public PadReport R; public bool IsConnected{get;set;} public string LastError{get{return "x";}} public bool Connect(){IsConnected=true;return true;} public bool Submit(PadReport r){R=r;return true;} public void Disconnect(){IsConnected=false;} public void Dispose(){} }
class FakeIn : IInputInjector { public string Log=""; public void Key(Keys k,bool d){Log+=(d?"+":"-")+k+" ";} public void MouseButton(MouseButtonId b,bool d){Log+=(d?"+":"-")+b+" ";} public void Wheel(int n){Log+="W"+n+" ";} public void MouseMove(int x,int y){} }
static class T {
 static void Check(bool c,string m){Console.WriteLine((c?"PASS ":"FAIL ")+m); if(!c) Environment.ExitCode=1;}
 static void Main(){
  var rep=new byte[26]; rep[1]=0x1A;
  // aiming X full right: hi=0xFF lo=0xC0 => 1023 ; rotation lever -512: hi=0x80 lo=0
  rep[9]=0xFF; rep[10]=0xC0; rep[11]=0x80; rep[13]=0x80; rep[23]=0xFF; rep[24]=0xC3; rep[25]=0xFE; rep[2]=0x01|0x40;
  var s=new ControllerState(); s.Parse(rep,26);
  Check(s.RawAxis[(int)ControlId.AimingX]==1023,"aimX raw 1023");
  Check(s.RawAxis[(int)ControlId.RotationLever]==-512,"rotation -512 got "+s.RawAxis[(int)ControlId.RotationLever]);
  Check(s.Tuner==3,"tuner 3"); Check(s.Gear==-2 && s.Down[(int)ControlId.GearR],"gear R");
  Check(s.Down[(int)ControlId.MainWeapon]&&s.Down[(int)ControlId.Start]&&!s.Down[(int)ControlId.Fire],"buttons");
  var st=new AppSettings(); var p=DefaultProfiles.Cockpit(); var m=new Mapper(); var f=new OutputFrame();
  m.Tick(s,true,0,0.004,p,st,f);
  Check(f.Pad.RX==32767,"RX full "+f.Pad.RX); Check(f.Pad.LX==-32768,"LX full left "+f.Pad.LX);
  Check(f.Pad.RightTrigger==255,"RT full"); Check((f.Pad.Buttons&0x0200)!=0,"RB from MainWeapon"); Check((f.Pad.Buttons&0x0010)!=0,"Start");
  Check(f.Pad.LY==-32768,"Gear R => LY -1 "+f.Pad.LY);
  // toggle filter control on -> pulse F5
  rep[6]=0x04; s.Parse(rep,26); m.Tick(s,true,50,0.004,p,st,f); Check(f.Keys[(int)Keys.F5],"F5 pulse on toggle flip"); m.Tick(s,true,150,0.004,p,st,f); Check(!f.Keys[(int)Keys.F5],"F5 pulse ended");
  // tuner CW event
  rep[24]=0xC4; s.Parse(rep,26); m.Tick(s,true,200,0.004,p,st,f); Check(f.Keys[(int)Keys.PageDown],"tuner CW -> PageDown");
  // gear up R->N
  rep[25]=0xFF; s.Parse(rep,26); m.Tick(s,true,300,0.004,p,st,f); Check(f.Pad.LY==0,"gear N => LY 0");
  // LEDs: Start LED (7) high nibble of byte 3 bright
  Check((f.Leds[3]>>4)==15,"Start LED bright"); Check((f.Leds[2]&0xF)==2,"Eject LED dim");
  // disconnected => neutral
  m.Tick(s,false,400,0.004,p,st,f); Check(f.Pad.Buttons==0&&f.Pad.RX==0,"neutral when disconnected");
  // XML round trip
  var path=Path.GetTempFileName(); p.Save(path); var p2=Profile.Load(path);
  Check(p2.Bindings.Count==p.Bindings.Count && p2.Bindings[0].XboxAxis==p.Bindings[0].XboxAxis && p2.Bindings[3].Note==p.Bindings[3].Note,"profile XML round trip ("+p2.Bindings.Count+")");
  var k=p2.Bindings.Find(b=>b.Output==OutputKind.Key); Check(k.Key==p.Bindings.Find(b=>b.Output==OutputKind.Key).Key,"key round trip "+k.Key);
  // property filtering
  var props=System.ComponentModel.TypeDescriptor.GetProperties(k); Check(props["XboxAxis"]==null && props["Key"]!=null,"editor hides irrelevant props");
  // Engine end-to-end with fakes
  var usb=new FakeUsb(); usb.Rep=rep; var pad=new FakePad(); var inp=new FakeIn();
  var e=new Engine(usb,pad,inp,st); e.Profile=p; e.Start(); System.Threading.Thread.Sleep(300);
  Check(e.Connected && pad.R.RX==32767,"engine drives pad"); 
  rep[5]=0x10; System.Threading.Thread.Sleep(100); Check(!inp.Log.Contains("F5") && inp.Log.Contains("+D1"),"Comm1 -> key D1 down: "+inp.Log);
  e.Dispose(); Check(inp.Log.Contains("-D1"),"keys released on shutdown");
  Check(System.Runtime.InteropServices.Marshal.SizeOf(typeof(SBBridge.Platform.Windows.Native.INPUT))==40,"INPUT size 40");
 
  // UI smoke test
  var ui=new SBBridge.UI.MainForm(new Engine(new FakeUsb{Rep=rep},new FakePad(),new FakeIn(),st),st,false);
  var tm=new System.Windows.Forms.Timer{Interval=2500}; tm.Tick+=(a,b)=>{tm.Stop();
    var tabs=(TabControl)ui.Controls[0]; foreach(Control c in ui.Controls) if(c is TabControl) tabs=(TabControl)c;
    for(int i=0;i<tabs.TabCount;i++){ tabs.SelectedIndex=i; Application.DoEvents(); for(int w=0;w<20;w++){Application.DoEvents(); System.Threading.Thread.Sleep(30);} try { System.Diagnostics.Process.Start("import","-window root /tmp/tab"+i+".png").WaitForExit(); } catch { } }
    ui.Close();};
  Application.ThreadException+=(a,b)=>{Console.WriteLine("FAIL UI exception "+b.Exception); Environment.ExitCode=1;};
  st.CloseToTray=false; tm.Start(); Application.Run(ui); Console.WriteLine("PASS UI ran 2.5s without exceptions");
 }
}
