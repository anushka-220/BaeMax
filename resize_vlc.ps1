Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
  [DllImport("user32.dll")]
  public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
  [DllImport("user32.dll")]
  public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
}
"@

# Find VLC window
$handle = [Win32]::FindWindow("QWidget","VLC media player")

# Get screen width
Add-Type -AssemblyName System.Windows.Forms
$screenWidth = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width
$screenHeight = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height

# Compute 3/4 width
$targetWidth = [int]($screenWidth * 0.75)

# Move and resize VLC
[Win32]::MoveWindow($handle, 0, 0, $targetWidth, $screenHeight, $true)