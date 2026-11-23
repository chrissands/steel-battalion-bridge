// Platform abstraction. Windows implementations live in Platform/Windows.
// A Linux (Bazzite) port implements the same three interfaces with libusb + uinput.
using System;


namespace SBBridge.Core
{
    /// <summary>Raw USB access to the Steel Battalion controller.</summary>
    public interface IControllerTransport : IDisposable
    {
        bool IsOpen { get; }
        string LastError { get; }
        bool TryOpen();
        /// <summary>Returns bytes read, 0 on timeout, -1 on fatal error (device gone).</summary>
        int Read(byte[] buffer, int timeoutMs);
        bool Write(byte[] data);
        void Close();
    }

    /// <summary>Xbox 360-style report (same layout as XUSB / XINPUT_GAMEPAD).</summary>
    public struct PadReport
    {
        public ushort Buttons;
        public byte LeftTrigger, RightTrigger;
        public short LX, LY, RX, RY;

        public bool SameAs(PadReport o)
        {
            return Buttons == o.Buttons && LeftTrigger == o.LeftTrigger && RightTrigger == o.RightTrigger
                && LX == o.LX && LY == o.LY && RX == o.RX && RY == o.RY;
        }
    }

    /// <summary>A virtual XInput / Steam Input compatible gamepad.</summary>
    public interface IVirtualGamepad : IDisposable
    {
        bool IsConnected { get; }
        string LastError { get; }
        bool Connect();
        bool Submit(PadReport report);
        void Disconnect();
    }

    public enum MouseButtonId { Left, Right, Middle, X1, X2, WheelUp, WheelDown }

    /// <summary>Keyboard / mouse injection.</summary>
    public interface IInputInjector
    {
        void Key(KeyCode key, bool down);
        void MouseButton(MouseButtonId button, bool down);
        void Wheel(int notches);
        void MouseMove(int dx, int dy);
    }
}
