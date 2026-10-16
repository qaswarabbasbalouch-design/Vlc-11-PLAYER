using System;
using System.IO;
using System.Windows;
using System.Windows.Input;
using System.Windows.Threading;
using LibVLCSharp.Shared;
using Microsoft.Win32;

namespace NovaMediaPlayer
{
    public partial class MainWindow : Window
    {
        private LibVLC? _libVLC;
        private MediaPlayer? _mediaPlayer;
        private readonly DispatcherTimer _timer;
        private bool _isDraggingSeek = false;
        private bool _isFullscreen = false;
        private WindowState _previousState = WindowState.Normal;

        public MainWindow()
        {
            InitializeComponent();

            // Initialize LibVLC with Hardware Acceleration (Direct3D11 / DXVA2)
            Core.Initialize();

            string[] vlcOptions = new[]
            {
                "--avcodec-hw=any",              // Auto-select D3D11VA, DXVA2 or NVDEC
                "--network-caching=1000",        // Smooth network streaming
                "--file-caching=1000",           // Smooth 4K local playback
                "--no-sub-autodetect-fuzzy",     // Precise subtitle matching
                "--audio-resampler=soxr"         // High fidelity audio resampling
            };

            _libVLC = new LibVLC(enableDebugLogs: false, vlcOptions);
            _mediaPlayer = new MediaPlayer(_libVLC);
            MainVideoView.MediaPlayer = _mediaPlayer;

            _mediaPlayer.TimeChanged += MediaPlayer_TimeChanged;
            _mediaPlayer.LengthChanged += MediaPlayer_LengthChanged;
            _mediaPlayer.EndReached += MediaPlayer_EndReached;

            _timer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(250) };
            _timer.Tick += Timer_Tick;
            _timer.Start();
        }

        private void MediaPlayer_TimeChanged(object? sender, MediaPlayerTimeChangedEventArgs e)
        {
            if (_isDraggingSeek) return;
            Dispatcher.Invoke(() =>
            {
                TxtCurrentTime.Text = FormatMilliseconds(e.Time);
                if (_mediaPlayer != null && _mediaPlayer.Length > 0)
                {
                    SeekSlider.Value = (double)e.Time / _mediaPlayer.Length * 100.0;
                }
            });
        }

        private void MediaPlayer_LengthChanged(object? sender, MediaPlayerLengthChangedEventArgs e)
        {
            Dispatcher.Invoke(() => TxtDuration.Text = FormatMilliseconds(e.Length));
        }

        private void MediaPlayer_EndReached(object? sender, EventArgs e)
        {
            Dispatcher.Invoke(() =>
            {
                CenterPlayOverlay.Visibility = Visibility.Visible;
                SeekSlider.Value = 0;
            });
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            if (_mediaPlayer != null)
            {
                CenterPlayOverlay.Visibility = _mediaPlayer.IsPlaying ? Visibility.Collapsed : Visibility.Visible;
            }
        }

        public void PlayMediaFile(string filePath)
        {
            if (_libVLC == null || _mediaPlayer == null || !File.Exists(filePath)) return;
            using var media = new Media(_libVLC, new Uri(filePath));
            media.AddOption(":hwdec=auto");
            _mediaPlayer.Play(media);
            Title = $"Nova Media Player - {Path.GetFileName(filePath)}";
            TxtNowPlayingHeader.Text = $"• {Path.GetFileName(filePath)}";
        }

        private void BtnPlayPause_Click(object sender, RoutedEventArgs e)
        {
            if (_mediaPlayer == null) return;
            if (_mediaPlayer.IsPlaying)
            {
                _mediaPlayer.Pause();
                CenterPlayOverlay.Visibility = Visibility.Visible;
            }
            else
            {
                _mediaPlayer.Play();
                CenterPlayOverlay.Visibility = Visibility.Collapsed;
            }
        }

        private void CenterPlayOverlay_MouseDown(object sender, MouseButtonEventArgs e) => BtnPlayPause_Click(sender, e);
        private void BtnStop_Click(object sender, RoutedEventArgs e)
        {
            _mediaPlayer?.Stop();
            CenterPlayOverlay.Visibility = Visibility.Visible;
            SeekSlider.Value = 0;
            TxtCurrentTime.Text = "00:00:00";
        }

        private void MenuOpenFile_Click(object sender, RoutedEventArgs e)
        {
            var dlg = new OpenFileDialog
            {
                Title = "Open Media File",
                Filter = "Media Files|*.mp4;*.mkv;*.avi;*.mov;*.wmv;*.flv;*.webm;*.ts;*.m4v;*.mp3;*.flac;*.wav|All Files|*.*"
            };
            if (dlg.ShowDialog() == true) PlayMediaFile(dlg.FileName);
        }

        private void SeekSlider_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            if (_isDraggingSeek && _mediaPlayer != null && _mediaPlayer.Length > 0)
            {
                long targetMs = (long)((SeekSlider.Value / 100.0) * _mediaPlayer.Length);
                TxtCurrentTime.Text = FormatMilliseconds(targetMs);
            }
        }

        private void SeekSlider_PreviewMouseDown(object sender, MouseButtonEventArgs e) => _isDraggingSeek = true;
        private void SeekSlider_PreviewMouseUp(object sender, MouseButtonEventArgs e)
        {
            _isDraggingSeek = false;
            if (_mediaPlayer != null && _mediaPlayer.Length > 0)
            {
                _mediaPlayer.Position = (float)(SeekSlider.Value / 100.0);
            }
        }

        private void VolumeSlider_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            if (_mediaPlayer != null)
            {
                int vol = (int)VolumeSlider.Value;
                _mediaPlayer.Volume = vol;
                TxtVolume.Text = $"{vol}%";
            }
        }

        private void BtnMute_Click(object sender, RoutedEventArgs e)
        {
            if (_mediaPlayer != null)
            {
                _mediaPlayer.Mute = !_mediaPlayer.Mute;
                TxtVolume.Text = _mediaPlayer.Mute ? "Mute" : $"{_mediaPlayer.Volume}%";
            }
        }

        private void BtnFullscreen_Click(object sender, RoutedEventArgs e) => ToggleFullscreen();
        private void ToggleFullscreen()
        {
            _isFullscreen = !_isFullscreen;
            if (_isFullscreen)
            {
                _previousState = WindowState;
                WindowStyle = WindowStyle.None;
                WindowState = WindowState.Maximized;
            }
            else
            {
                WindowStyle = WindowStyle.None;
                WindowState = _previousState;
            }
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.Key)
            {
                case Key.Space:
                    BtnPlayPause_Click(sender, e);
                    e.Handled = true;
                    break;
                case Key.F:
                case Key.F11:
                    ToggleFullscreen();
                    e.Handled = true;
                    break;
                case Key.M:
                    BtnMute_Click(sender, e);
                    e.Handled = true;
                    break;
                case Key.Escape:
                    if (_isFullscreen) ToggleFullscreen();
                    break;
            }
        }

        private static string FormatMilliseconds(long ms)
        {
            var span = TimeSpan.FromMilliseconds(Math.Max(0, ms));
            return span.ToString(@"hh\:mm\:ss");
        }

        private void TitleBar_MouseDown(object sender, MouseButtonEventArgs e) { if (e.ChangedButton == MouseButton.Left) DragMove(); }
        private void BtnMin_Click(object sender, RoutedEventArgs e) => WindowState = WindowState.Minimized;
        private void BtnMax_Click(object sender, RoutedEventArgs e) => WindowState = WindowState == WindowState.Maximized ? WindowState.Normal : WindowState.Maximized;
        private void BtnClose_Click(object sender, RoutedEventArgs e) => Close();
        private void Window_MouseDoubleClick(object sender, MouseButtonEventArgs e) { if (e.GetPosition(this).Y < 36) BtnMax_Click(sender, e); }
        private void VideoView_MouseDown(object sender, MouseButtonEventArgs e) { if (e.ClickCount == 2) ToggleFullscreen(); else BtnPlayPause_Click(sender, e); }
        private void BtnPrev_Click(object sender, RoutedEventArgs e) {}
        private void BtnNext_Click(object sender, RoutedEventArgs e) {}
        private void BtnRepeat_Click(object sender, RoutedEventArgs e) {}
        private void BtnShuffle_Click(object sender, RoutedEventArgs e) {}
        private void BtnAudioDrop_Click(object sender, RoutedEventArgs e) {}
        private void BtnSubtitleDrop_Click(object sender, RoutedEventArgs e) {}
        private void BtnSettings_Click(object sender, RoutedEventArgs e) {}
        private void MenuOpenFolder_Click(object sender, RoutedEventArgs e) {}
        private void MenuOpenStream_Click(object sender, RoutedEventArgs e) {}
        private void MenuSavePlaylist_Click(object sender, RoutedEventArgs e) {}
        private void MenuSeekForward_Click(object sender, RoutedEventArgs e) { if (_mediaPlayer != null) _mediaPlayer.Time += 5000; }
        private void MenuSeekBackward_Click(object sender, RoutedEventArgs e) { if (_mediaPlayer != null) _mediaPlayer.Time -= 5000; }
        private void MenuSpeed_Opened(object sender, RoutedEventArgs e) {}
        private void MenuSetSpeed_Click(object sender, RoutedEventArgs e) {}
        private void BtnEqualizer_Click(object sender, RoutedEventArgs e) {}
        private void BtnMediaInfo_Click(object sender, RoutedEventArgs e) {}
        private void BtnPreferences_Click(object sender, RoutedEventArgs e) {}
        private void BtnPlaylist_Click(object sender, RoutedEventArgs e) {}
        private void MenuAlwaysOnTop_Click(object sender, RoutedEventArgs e) => Topmost = !Topmost;
        private void MenuSnapshot_Click(object sender, RoutedEventArgs e) {}
        private void MenuAddSub_Click(object sender, RoutedEventArgs e) {}
        private void Window_MouseMove(object sender, MouseEventArgs e) {}

        protected override void OnClosed(EventArgs e)
        {
            base.OnClosed(e);
            _mediaPlayer?.Dispose();
            _libVLC?.Dispose();
        }
    }
}
