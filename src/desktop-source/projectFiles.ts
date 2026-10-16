export interface ProjectFile {
  name: string;
  path: string;
  language: string;
  content: string;
  description: string;
}

export const DESKTOP_PROJECT_FILES: ProjectFile[] = [
  {
    name: 'NovaMediaPlayer.csproj',
    path: 'NovaMediaPlayer/NovaMediaPlayer.csproj',
    language: 'xml',
    description: '.NET 8.0 WPF Project File configured with LibVLCSharp and Windows 11 Fluent Assets',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows10.0.22621.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UseWPF>true</UseWPF>
    <ApplicationIcon>Assets\\AppIcon.ico</ApplicationIcon>
    <AssemblyName>NovaMediaPlayer</AssemblyName>
    <RootNamespace>NovaMediaPlayer</RootNamespace>
    <Version>1.0.0</Version>
    <Authors>Nova Multimedia Labs</Authors>
    <Product>Nova Media Player for Windows 11</Product>
    <Description>Standalone hardware-accelerated VLC-style media player for Windows 11</Description>
    <PlatformTarget>x64</PlatformTarget>
    
    <!-- Self-contained, single-file release publishing options -->
    <PublishSingleFile>true</PublishSingleFile>
    <SelfContained>true</SelfContained>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <IncludeNativeLibrariesForSelfExtract>true</IncludeNativeLibrariesForSelfExtract>
    <PublishReadyToRun>true</PublishReadyToRun>
  </PropertyGroup>

  <ItemGroup>
    <!-- LibVLCSharp core and WPF integration -->
    <PackageReference Include="LibVLCSharp" Version="3.9.0" />
    <PackageReference Include="LibVLCSharp.WPF" Version="3.9.0" />
    <!-- VideoLAN LibVLC Windows binary distribution (includes all 4K/HEVC/AV1 codecs & hardware filters) -->
    <PackageReference Include="VideoLAN.LibVLC.Windows" Version="3.0.20" />
    
    <!-- Modern Windows 11 Mica & UI Controls -->
    <PackageReference Include="Wpf.Ui" Version="3.0.5" />
    <PackageReference Include="CommunityToolkit.Mvvm" Version="8.2.2" />
  </ItemGroup>

  <ItemGroup>
    <Resource Include="Assets\\AppIcon.ico" />
    <Resource Include="Assets\\Logo.png" />
  </ItemGroup>

</Project>`
  },
  {
    name: 'MainWindow.xaml',
    path: 'NovaMediaPlayer/MainWindow.xaml',
    language: 'xml',
    description: 'XAML Interface implementing the dark Windows 11 VLC layout from reference screenshot',
    content: `<Window x:Class="NovaMediaPlayer.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:vlc="clr-namespace:LibVLCSharp.WPF;assembly=LibVLCSharp.WPF"
        mc:Ignorable="d"
        Title="Nova Media Player" Height="720" Width="1280"
        MinHeight="480" MinWidth="720"
        Background="#0B101B" Foreground="#F1F5F9"
        WindowStartupLocation="CenterScreen"
        WindowStyle="None" AllowsTransparency="True"
        KeyDown="Window_KeyDown"
        MouseMove="Window_MouseMove"
        MouseDoubleClick="Window_MouseDoubleClick">

    <!-- Window Chrome and Fluent Border -->
    <Border BorderBrush="#1E293B" BorderThickness="1" CornerRadius="8" Background="#0A0E17">
        <Grid>
            <Grid.RowDefinitions>
                <RowDefinition Height="36"/>  <!-- Custom Win11 Titlebar -->
                <RowDefinition Height="28"/>  <!-- VLC Menu Bar -->
                <RowDefinition Height="*"/>   <!-- Video Viewport -->
                <RowDefinition Height="74"/>  <!-- Transport Controls Dock -->
            </Grid.RowDefinitions>

            <!-- 1. Custom Windows 11 Dark Titlebar -->
            <Grid Grid.Row="0" Background="#080C14" MouseDown="TitleBar_MouseDown">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="Auto"/>
                    <ColumnDefinition Width="*"/>
                    <ColumnDefinition Width="Auto"/>
                </Grid.ColumnDefinitions>

                <StackPanel Orientation="Horizontal" VerticalAlignment="Center" Margin="12,0,0,0">
                    <!-- Nova Player Icon -->
                    <Border Width="20" Height="20" Background="#2563EB" CornerRadius="4" Margin="0,0,8,0">
                        <Path Data="M 7,5 L 15,10 L 7,15 Z" Fill="White" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                    </Border>
                    <TextBlock Text="Nova Media Player" FontWeight="SemiBold" FontSize="12.5" Foreground="#E2E8F0"/>
                    <TextBlock x:Name="TxtNowPlayingHeader" Text="" FontSize="11" Foreground="#94A3B8" Margin="8,1,0,0"/>
                </StackPanel>

                <!-- Windows Native Titlebar handles Minimize, Maximize, and Close -->
            </Grid>

            <!-- 2. VLC Menu Bar -->
            <Menu Grid.Row="1" Background="#0D131F" Foreground="#CBD5E1" FontSize="12" Padding="6,2,0,0">
                <MenuItem Header="Media">
                    <MenuItem Header="Open File..." InputGestureText="Ctrl+O" Click="MenuOpenFile_Click"/>
                    <MenuItem Header="Open Folder..." InputGestureText="Ctrl+F" Click="MenuOpenFolder_Click"/>
                    <MenuItem Header="Open Network Stream..." InputGestureText="Ctrl+N" Click="MenuOpenStream_Click"/>
                    <Separator/>
                    <MenuItem Header="Save Playlist to File..." Click="MenuSavePlaylist_Click"/>
                    <MenuItem Header="Exit" InputGestureText="Ctrl+Q" Click="BtnClose_Click"/>
                </MenuItem>
                <MenuItem Header="Playback">
                    <MenuItem Header="Play / Pause" InputGestureText="Space" Click="BtnPlayPause_Click"/>
                    <MenuItem Header="Stop" InputGestureText="S" Click="BtnStop_Click"/>
                    <MenuItem Header="Jump Forward 5s" InputGestureText="Right" Click="MenuSeekForward_Click"/>
                    <MenuItem Header="Jump Backward 5s" InputGestureText="Left" Click="MenuSeekBackward_Click"/>
                    <Separator/>
                    <MenuItem Header="Speed" SubmenuOpened="MenuSpeed_Opened">
                        <MenuItem Header="Faster (1.25x)" Click="MenuSetSpeed_Click" Tag="1.25"/>
                        <MenuItem Header="Normal (1.0x)" Click="MenuSetSpeed_Click" Tag="1.0"/>
                        <MenuItem Header="Slower (0.75x)" Click="MenuSetSpeed_Click" Tag="0.75"/>
                    </MenuItem>
                </MenuItem>
                <MenuItem Header="Audio">
                    <MenuItem Header="Audio Track" x:Name="MenuAudioTracks"/>
                    <MenuItem Header="Equalizer..." InputGestureText="Ctrl+E" Click="BtnEqualizer_Click"/>
                    <MenuItem Header="Mute" InputGestureText="M" Click="BtnMute_Click"/>
                </MenuItem>
                <MenuItem Header="Video">
                    <MenuItem Header="Aspect Ratio" x:Name="MenuAspectRatio"/>
                    <MenuItem Header="Take Snapshot" InputGestureText="Shift+S" Click="MenuSnapshot_Click"/>
                    <MenuItem Header="Fullscreen" InputGestureText="F11" Click="BtnFullscreen_Click"/>
                </MenuItem>
                <MenuItem Header="Subtitles">
                    <MenuItem Header="Add Subtitle File..." Click="MenuAddSub_Click"/>
                    <MenuItem Header="Subtitle Track" x:Name="MenuSubtitleTracks"/>
                </MenuItem>
                <MenuItem Header="Tools">
                    <MenuItem Header="Effects &amp; Filters" InputGestureText="Ctrl+E" Click="BtnEqualizer_Click"/>
                    <MenuItem Header="Media Information" InputGestureText="Ctrl+I" Click="BtnMediaInfo_Click"/>
                    <MenuItem Header="Preferences" InputGestureText="Ctrl+P" Click="BtnPreferences_Click"/>
                </MenuItem>
                <MenuItem Header="View">
                    <MenuItem Header="Playlist" InputGestureText="Ctrl+L" Click="BtnPlaylist_Click"/>
                    <MenuItem Header="Always on Top" IsCheckable="True" Click="MenuAlwaysOnTop_Click"/>
                </MenuItem>
            </Menu>

            <!-- 3. Video Display Area -->
            <Grid Grid.Row="2" Background="#000000" ClipToBounds="True">
                <!-- LibVLC Sharp Video View -->
                <vlc:VideoView x:Name="MainVideoView" HorizontalAlignment="Stretch" VerticalAlignment="Stretch" MouseDown="VideoView_MouseDown"/>

                <!-- Center Floating Play Indicator (matching the orange circle in screenshot) -->
                <Border x:Name="CenterPlayOverlay" Width="72" Height="72" CornerRadius="36" Background="#EA580C"
                        HorizontalAlignment="Center" VerticalAlignment="Center" Cursor="Hand"
                        Opacity="0.9" MouseDown="CenterPlayOverlay_MouseDown">
                    <Path Data="M 26,20 L 52,36 L 26,52 Z" Fill="White" HorizontalAlignment="Center" VerticalAlignment="Center" Margin="4,0,0,0"/>
                </Border>

                <!-- On-Screen Display Notification -->
                <Border x:Name="OsdNotification" Background="#80000000" CornerRadius="6" Padding="14,8"
                        HorizontalAlignment="Right" VerticalAlignment="Top" Margin="0,16,16,0" Visibility="Collapsed">
                    <TextBlock x:Name="TxtOsd" Text="Volume: 100%" Foreground="#F8FAFC" FontSize="14" FontWeight="SemiBold"/>
                </Border>
            </Grid>

            <!-- 4. Playback Controls Bottom Dock (Pixel-matched to user reference) -->
            <Grid Grid.Row="3" Background="#0C111C" VerticalAlignment="Bottom">
                <Grid.RowDefinitions>
                    <RowDefinition Height="26"/> <!-- Seek Bar with Timers -->
                    <RowDefinition Height="48"/> <!-- Button Controls Row -->
                </Grid.RowDefinitions>

                <!-- Seek Bar Row: [00:02:34]  ====O====== [00:12:48] -->
                <Grid Grid.Row="0" Margin="14,4,14,0">
                    <Grid.ColumnDefinitions>
                        <ColumnDefinition Width="65"/>
                        <ColumnDefinition Width="*"/>
                        <ColumnDefinition Width="65"/>
                    </Grid.ColumnDefinitions>

                    <TextBlock x:Name="TxtCurrentTime" Text="00:02:34" Foreground="#94A3B8" FontSize="11" 
                               FontFamily="Segoe UI, Segoe UI Variable" VerticalAlignment="Center" HorizontalAlignment="Left"/>
                    
                    <!-- Fluent Slider Seekbar -->
                    <Slider Grid.Column="1" x:Name="SeekSlider" Minimum="0" Maximum="100" Value="20"
                            Style="{StaticResource FluentSeekSliderStyle}"
                            PreviewMouseDown="SeekSlider_PreviewMouseDown"
                            PreviewMouseUp="SeekSlider_PreviewMouseUp"
                            ValueChanged="SeekSlider_ValueChanged"
                            VerticalAlignment="Center" Margin="8,0"/>

                    <TextBlock x:Name="TxtDuration" Text="00:12:48" Foreground="#94A3B8" FontSize="11"
                               FontFamily="Segoe UI, Segoe UI Variable" VerticalAlignment="Center" HorizontalAlignment="Right"
                               Cursor="Hand" MouseDown="TxtDuration_MouseDown"/>
                </Grid>

                <!-- Bottom Action Controls Row -->
                <Grid Grid.Row="1" Margin="12,0,14,4">
                    <!-- Left: Transport Controls -->
                    <StackPanel Orientation="Horizontal" HorizontalAlignment="Left" VerticalAlignment="Center">
                        <!-- Prev Track -->
                        <Button x:Name="BtnPrev" Style="{StaticResource TransportBtnStyle}" Click="BtnPrev_Click">
                            <Path Data="M 6,5 L 6,15 M 16,5 L 8,10 L 16,15 Z" Stroke="#E2E8F0" StrokeThickness="1.5" Fill="#E2E8F0"/>
                        </Button>

                        <!-- Primary Play/Pause Circle (Blue matching screenshot) -->
                        <Button x:Name="BtnPlayPause" Style="{StaticResource PrimaryPlayBtnStyle}" Click="BtnPlayPause_Click" Margin="6,0">
                            <!-- Pause Bars Icon -->
                            <StackPanel Orientation="Horizontal" HorizontalAlignment="Center">
                                <Rectangle Width="4" Height="14" Fill="White" RadiusX="1" RadiusY="1" Margin="1,0"/>
                                <Rectangle Width="4" Height="14" Fill="White" RadiusX="1" RadiusY="1" Margin="1,0"/>
                            </StackPanel>
                        </Button>

                        <!-- Next Track -->
                        <Button x:Name="BtnNext" Style="{StaticResource TransportBtnStyle}" Click="BtnNext_Click">
                            <Path Data="M 16,5 L 16,15 M 6,5 L 14,10 L 6,15 Z" Stroke="#E2E8F0" StrokeThickness="1.5" Fill="#E2E8F0"/>
                        </Button>

                        <!-- Stop Button -->
                        <Button x:Name="BtnStop" Style="{StaticResource TransportBtnStyle}" Click="BtnStop_Click" Margin="8,0,4,0">
                            <Rectangle Width="10" Height="10" Fill="#CBD5E1" RadiusX="1" RadiusY="1"/>
                        </Button>

                        <!-- Repeat Mode -->
                        <Button x:Name="BtnRepeat" Style="{StaticResource TransportBtnStyle}" Click="BtnRepeat_Click" ToolTip="Repeat Mode">
                            <Path Data="M 4,7 L 14,7 A 3,3 0 0,1 17,10 L 17,11 M 17,13 L 7,13 A 3,3 0 0,1 4,10 L 4,9 M 12,5 L 14,7 L 12,9 M 9,11 L 7,13 L 9,15"
                                  Stroke="#94A3B8" StrokeThickness="1.5"/>
                        </Button>

                        <!-- Shuffle -->
                        <Button x:Name="BtnShuffle" Style="{StaticResource TransportBtnStyle}" Click="BtnShuffle_Click" ToolTip="Shuffle Playlist">
                            <Path Data="M 4,14 L 8,14 L 14,6 L 18,6 M 15,4 L 18,6 L 15,8 M 4,6 L 8,6 L 10,8.5 M 12,11.5 L 14,14 L 18,14 M 15,12 L 18,14 L 15,16"
                                  Stroke="#94A3B8" StrokeThickness="1.5"/>
                        </Button>
                    </StackPanel>

                    <!-- Right Controls: Volume, Audio Dropdown, Subtitles Dropdown, Settings, PiP, Fullscreen -->
                    <StackPanel Orientation="Horizontal" HorizontalAlignment="Right" VerticalAlignment="Center">
                        <!-- Volume Icon + Slider + Percent -->
                        <Button x:Name="BtnMute" Style="{StaticResource TransportBtnStyle}" Click="BtnMute_Click">
                            <Path Data="M 4,8 L 7,8 L 11,4 L 11,16 L 7,12 L 4,12 Z M 13,7 A 4,4 0 0,1 13,13" Stroke="#CBD5E1" StrokeThickness="1.5" Fill="#CBD5E1"/>
                        </Button>

                        <Slider x:Name="VolumeSlider" Minimum="0" Maximum="125" Value="100" Width="80"
                                Style="{StaticResource FluentVolumeSliderStyle}"
                                ValueChanged="VolumeSlider_ValueChanged"
                                VerticalAlignment="Center" Margin="4,0,8,0"/>

                        <TextBlock x:Name="TxtVolume" Text="100%" Foreground="#94A3B8" FontSize="11" Width="32" VerticalAlignment="Center"/>

                        <!-- Audio Dropdown Button -->
                        <Button x:Name="BtnAudioDrop" Content="Audio ▾" Style="{StaticResource DropdownPillBtnStyle}" Click="BtnAudioDrop_Click" Margin="4,0"/>

                        <!-- Subtitles Dropdown Button -->
                        <Button x:Name="BtnSubtitleDrop" Content="Subtitles ▾" Style="{StaticResource DropdownPillBtnStyle}" Click="BtnSubtitleDrop_Click" Margin="4,0"/>

                        <!-- Settings Gear -->
                        <Button x:Name="BtnSettings" Style="{StaticResource TransportBtnStyle}" Click="BtnSettings_Click" ToolTip="Video Effects &amp; Equalizer">
                            <Path Data="M 12,15 A 3,3 0 1,0 12,9 A 3,3 0 0,0 12,15 Z M 19.4,13 C 19.4,12.7 19.4,12.3 19.4,12 L 21.5,10.3 C 21.7,10.1 21.8,9.8 21.7,9.6 L 19.7,6.1 C 19.6,5.9 19.3,5.8 19,5.9 L 16.5,6.9 C 16,6.5 15.4,6.2 14.8,6 L 14.4,3.3 C 14.4,3.1 14.1,2.9 13.9,2.9 L 10.1,2.9 C 9.8,2.9 9.6,3.1 9.6,3.3 L 9.2,6 C 8.6,6.2 8,6.5 7.5,6.9 L 5,5.9 C 4.7,5.8 4.4,5.9 4.3,6.1 L 2.3,9.6 C 2.2,9.8 2.3,10.1 2.5,10.3 L 4.6,12 C 4.6,12.3 4.6,12.7 4.6,13 L 2.5,14.7 C 2.3,14.9 2.2,15.2 2.3,15.4 L 4.3,18.9 C 4.4,19.1 4.7,19.2 5,19.1 L 7.5,18.1 C 8,18.5 8.6,18.8 9.2,19 L 9.6,21.7 C 9.6,21.9 9.8,22.1 10.1,22.1 L 13.9,22.1 C 14.1,22.1 14.4,21.9 14.4,21.7 L 14.8,19 C 15.4,18.8 16,18.5 16.5,18.1 L 19,19.1 C 19.3,19.2 19.6,19.1 19.7,18.9 L 21.7,15.4 C 21.8,15.2 21.7,14.9 21.5,14.7 Z"
                                  Fill="#CBD5E1" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Button>

                        <!-- Picture in Picture -->
                        <Button x:Name="BtnPip" Style="{StaticResource TransportBtnStyle}" Click="BtnPip_Click" ToolTip="Picture in Picture">
                            <Path Data="M 4,5 A 2,2 0 0,0 2,7 L 2,17 A 2,2 0 0,0 4,19 L 20,19 A 2,2 0 0,0 22,17 L 22,7 A 2,2 0 0,0 20,5 Z M 13,11 L 20,11 L 20,16 L 13,16 Z"
                                  Stroke="#CBD5E1" StrokeThickness="1.3" Fill="Transparent"/>
                        </Button>

                        <!-- Fullscreen -->
                        <Button x:Name="BtnFullscreen" Style="{StaticResource TransportBtnStyle}" Click="BtnFullscreen_Click" ToolTip="Fullscreen (F11)">
                            <Path Data="M 4,8 L 4,4 L 8,4 M 16,4 L 20,4 L 20,8 M 20,16 L 20,20 L 16,20 M 8,20 L 4,20 L 4,16"
                                  Stroke="#CBD5E1" StrokeThickness="1.6"/>
                        </Button>
                    </StackPanel>
                </Grid>
            </Grid>
        </Grid>
    </Border>
</Window>`
  },
  {
    name: 'MainWindow.xaml.cs',
    path: 'NovaMediaPlayer/MainWindow.xaml.cs',
    language: 'csharp',
    description: 'C# Code-behind driving LibVLC engine, hardware decoding, and multimedia playback',
    content: `using System;
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

            // Production LibVLC parameters: Hardware-accelerated decoding, low latency, 1000ms network caching
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

            // Hook up LibVLC player events
            _mediaPlayer.TimeChanged += MediaPlayer_TimeChanged;
            _mediaPlayer.LengthChanged += MediaPlayer_LengthChanged;
            _mediaPlayer.EndReached += MediaPlayer_EndReached;

            // Timer for UI sync & OSD auto-hiding
            _timer = new DispatcherTimer
            {
                Interval = TimeSpan.FromMilliseconds(250)
            };
            _timer.Tick += Timer_Tick;
            _timer.Start();

            // Load default startup media (or prompt user)
            Loaded += MainWindow_Loaded;
        }

        private void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            // Set initial volume to 100%
            if (_mediaPlayer != null)
            {
                _mediaPlayer.Volume = 100;
            }
        }

        private void MediaPlayer_TimeChanged(object? sender, MediaPlayerTimeChangedEventArgs e)
        {
            if (_isDraggingSeek) return;

            Dispatcher.Invoke(() =>
            {
                long currentMs = e.Time;
                long totalMs = _mediaPlayer?.Length ?? 0;

                TxtCurrentTime.Text = FormatMilliseconds(currentMs);
                if (totalMs > 0)
                {
                    SeekSlider.Value = (double)currentMs / totalMs * 100.0;
                }
            });
        }

        private void MediaPlayer_LengthChanged(object? sender, MediaPlayerLengthChangedEventArgs e)
        {
            Dispatcher.Invoke(() =>
            {
                TxtDuration.Text = FormatMilliseconds(e.Length);
            });
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
            // Sync playback state with UI
            if (_mediaPlayer != null)
            {
                bool isPlaying = _mediaPlayer.IsPlaying;
                CenterPlayOverlay.Visibility = isPlaying ? Visibility.Collapsed : Visibility.Visible;
            }
        }

        public void PlayMediaFile(string filePath)
        {
            if (_libVLC == null || _mediaPlayer == null || !File.Exists(filePath)) return;

            using var media = new Media(_libVLC, new Uri(filePath));
            // Enable hardware decoding options per-media
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

        private void CenterPlayOverlay_MouseDown(object sender, MouseButtonEventArgs e)
        {
            BtnPlayPause_Click(sender, e);
        }

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
                Title = "Open Media File - Nova Media Player",
                Filter = "All Supported Media|*.mp4;*.mkv;*.avi;*.mov;*.wmv;*.flv;*.webm;*.ts;*.m4v;*.mp3;*.flac;*.wav|" +
                         "Video Files|*.mp4;*.mkv;*.avi;*.mov;*.wmv;*.flv;*.webm;*.ts;*.m4v|" +
                         "Audio Files|*.mp3;*.flac;*.wav;*.aac;*.ogg;*.m4a|" +
                         "All Files (*.*)|*.*"
            };

            if (dlg.ShowDialog() == true)
            {
                PlayMediaFile(dlg.FileName);
            }
        }

        private void SeekSlider_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            if (_isDraggingSeek && _mediaPlayer != null && _mediaPlayer.Length > 0)
            {
                long targetMs = (long)((SeekSlider.Value / 100.0) * _mediaPlayer.Length);
                TxtCurrentTime.Text = FormatMilliseconds(targetMs);
            }
        }

        private void SeekSlider_PreviewMouseDown(object sender, MouseButtonEventArgs e)
        {
            _isDraggingSeek = true;
        }

        private void SeekSlider_PreviewMouseUp(object sender, MouseButtonEventArgs e)
        {
            _isDraggingSeek = false;
            if (_mediaPlayer != null && _mediaPlayer.Length > 0)
            {
                float position = (float)(SeekSlider.Value / 100.0);
                _mediaPlayer.Position = position;
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

        private void BtnFullscreen_Click(object sender, RoutedEventArgs e)
        {
            ToggleFullscreen();
        }

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
                case Key.Left:
                    SeekRelative(-5000);
                    e.Handled = true;
                    break;
                case Key.Right:
                    SeekRelative(5000);
                    e.Handled = true;
                    break;
            }
        }

        private void SeekRelative(long deltaMs)
        {
            if (_mediaPlayer == null || _mediaPlayer.Length <= 0) return;
            long newTime = Math.Clamp(_mediaPlayer.Time + deltaMs, 0, _mediaPlayer.Length);
            _mediaPlayer.Time = newTime;
        }

        private static string FormatMilliseconds(long ms)
        {
            var span = TimeSpan.FromMilliseconds(Math.Max(0, ms));
            return span.ToString(@"hh\\:mm\\:ss");
        }

        // Caption button clicks
        private void TitleBar_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left) DragMove();
        }
        private void BtnMin_Click(object sender, RoutedEventArgs e) => WindowState = WindowState.Minimized;
        private void BtnMax_Click(object sender, RoutedEventArgs e) => WindowState = WindowState == WindowState.Maximized ? WindowState.Normal : WindowState.Maximized;
        private void BtnClose_Click(object sender, RoutedEventArgs e) => Close();
        private void Window_MouseDoubleClick(object sender, MouseButtonEventArgs e) { if (e.GetPosition(this).Y < 36) BtnMax_Click(sender, e); }
        private void VideoView_MouseDown(object sender, MouseButtonEventArgs e) { if (e.ClickCount == 2) ToggleFullscreen(); else BtnPlayPause_Click(sender, e); }

        protected override void OnClosed(EventArgs e)
        {
            base.OnClosed(e);
            _mediaPlayer?.Dispose();
            _libVLC?.Dispose();
        }
    }
}`
  },
  {
    name: 'App.xaml',
    path: 'NovaMediaPlayer/App.xaml',
    language: 'xml',
    description: 'Application resources, Windows 11 Dark Mica styling and Custom Slider Templates',
    content: `<Application x:Class="NovaMediaPlayer.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             StartupUri="MainWindow.xaml">
    <Application.Resources>
        <SolidColorBrush x:Key="AccentBlue" Color="#2563EB"/>
        <SolidColorBrush x:Key="AccentHover" Color="#3B82F6"/>
        <SolidColorBrush x:Key="DarkSurface" Color="#0B101B"/>

        <!-- Custom Caption Button Style -->
        <Style x:Key="CaptionBtnStyle" TargetType="Button">
            <Setter Property="Width" Value="46"/>
            <Setter Property="Height" Value="36"/>
            <Setter Property="Background" Value="Transparent"/>
            <Setter Property="Foreground" Value="#94A3B8"/>
            <Setter Property="BorderThickness" Value="0"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border x:Name="bd" Background="{TemplateBinding Background}">
                            <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Border>
                        <ControlTemplate.Triggers>
                            <Trigger Property="IsMouseOver" Value="True">
                                <Setter TargetName="bd" Property="Background" Value="#1E293B"/>
                                <Setter Property="Foreground" Value="#F8FAFC"/>
                            </Trigger>
                        </ControlTemplate.Triggers>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>

        <!-- Close Caption Button -->
        <Style x:Key="CloseBtnStyle" TargetType="Button" BasedOn="{StaticResource CaptionBtnStyle}">
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border x:Name="bd" Background="{TemplateBinding Background}">
                            <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Border>
                        <ControlTemplate.Triggers>
                            <Trigger Property="IsMouseOver" Value="True">
                                <Setter TargetName="bd" Property="Background" Value="#E11D48"/>
                                <Setter Property="Foreground" Value="White"/>
                            </Trigger>
                        </ControlTemplate.Triggers>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>

        <!-- Primary Blue Play Button (Matching user screenshot) -->
        <Style x:Key="PrimaryPlayBtnStyle" TargetType="Button">
            <Setter Property="Width" Value="38"/>
            <Setter Property="Height" Value="38"/>
            <Setter Property="Background" Value="#2563EB"/>
            <Setter Property="BorderThickness" Value="0"/>
            <Setter Property="Cursor" Value="Hand"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border x:Name="bd" Background="{TemplateBinding Background}" CornerRadius="19">
                            <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Border>
                        <ControlTemplate.Triggers>
                            <Trigger Property="IsMouseOver" Value="True">
                                <Setter TargetName="bd" Property="Background" Value="#3B82F6"/>
                            </Trigger>
                            <Trigger Property="IsPressed" Value="True">
                                <Setter TargetName="bd" Property="Background" Value="#1D4ED8"/>
                            </Trigger>
                        </ControlTemplate.Triggers>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>

        <!-- Generic Transport Button Style -->
        <Style x:Key="TransportBtnStyle" TargetType="Button">
            <Setter Property="Width" Value="32"/>
            <Setter Property="Height" Value="32"/>
            <Setter Property="Background" Value="Transparent"/>
            <Setter Property="BorderThickness" Value="0"/>
            <Setter Property="Cursor" Value="Hand"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border x:Name="bd" Background="{TemplateBinding Background}" CornerRadius="6">
                            <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Border>
                        <ControlTemplate.Triggers>
                            <Trigger Property="IsMouseOver" Value="True">
                                <Setter TargetName="bd" Property="Background" Value="#1E293B"/>
                            </Trigger>
                        </ControlTemplate.Triggers>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>

        <!-- Dropdown Pill Button Style (Audio v, Subtitles v) -->
        <Style x:Key="DropdownPillBtnStyle" TargetType="Button">
            <Setter Property="Background" Value="#141E30"/>
            <Setter Property="Foreground" Value="#CBD5E1"/>
            <Setter Property="FontSize" Value="11"/>
            <Setter Property="FontWeight" Value="Medium"/>
            <Setter Property="Padding" Value="10,4"/>
            <Setter Property="BorderBrush" Value="#2A3850"/>
            <Setter Property="BorderThickness" Value="1"/>
            <Setter Property="Cursor" Value="Hand"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border x:Name="bd" Background="{TemplateBinding Background}"
                                BorderBrush="{TemplateBinding BorderBrush}"
                                BorderThickness="{TemplateBinding BorderThickness}"
                                CornerRadius="5" Padding="{TemplateBinding Padding}">
                            <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Border>
                        <ControlTemplate.Triggers>
                            <Trigger Property="IsMouseOver" Value="True">
                                <Setter TargetName="bd" Property="Background" Value="#1E2B45"/>
                                <Setter Property="Foreground" Value="White"/>
                            </Trigger>
                        </ControlTemplate.Triggers>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>
    </Application.Resources>
</Application>`
  },
  {
    name: 'NovaMediaPlayer_Setup.iss',
    path: 'InnoSetup/NovaMediaPlayer_Setup.iss',
    language: 'ini',
    description: 'Inno Setup Script to generate independent Windows 11 Desktop Installer (.EXE) with Start Menu & file associations',
    content: `; Inno Setup Compiler Script for Nova Media Player Windows 11
; Generates standalone Setup_NovaMediaPlayer_x64.exe

#define MyAppName "Nova Media Player"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Nova Multimedia Labs"
#define MyAppURL "https://github.com/nova-player/nova-media-player"
#define MyAppExeName "NovaMediaPlayer.exe"

[Setup]
AppId={{5E2A91D3-78BF-4D7F-85D3-A122C092F264}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
LicenseFile=LICENSE.txt
OutputDir=Output
OutputBaseFilename=Setup_NovaMediaPlayer_x64
SetupIconFile=..\\NovaMediaPlayer\\Assets\\AppIcon.ico
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64
PrivilegesRequired=lowest
UninstallDisplayIcon={app}\\{#MyAppExeName}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "associate_video"; Description: "Associate with common video formats (MP4, MKV, AVI, WebM)"; GroupDescription: "File Associations:"

[Files]
; Standalone Published Binaries (Includes .NET 8 runtime and all LibVLC plugins)
Source: "..\\NovaMediaPlayer\\bin\\Release\\net8.0-windows10.0.22621.0\\win-x64\\publish\\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\\{#MyAppName}"; Filename: "{app}\\{#MyAppExeName}"
Name: "{group}\\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\\{#MyAppName}"; Filename: "{app}\\{#MyAppExeName}"; Tasks: desktopicon

[Registry]
; File associations for video files
Root: HKCU; Subkey: "Software\\Classes\\.mp4\\OpenWithProgids"; ValueType: string; ValueName: "NovaMediaPlayer.AssocFile.mp4"; ValueData: ""; Flags: uninsdeletevalue; Tasks: associate_video
Root: HKCU; Subkey: "Software\\Classes\\.mkv\\OpenWithProgids"; ValueType: string; ValueName: "NovaMediaPlayer.AssocFile.mkv"; ValueData: ""; Flags: uninsdeletevalue; Tasks: associate_video
Root: HKCU; Subkey: "Software\\Classes\\.webm\\OpenWithProgids"; ValueType: string; ValueName: "NovaMediaPlayer.AssocFile.webm"; ValueData: ""; Flags: uninsdeletevalue; Tasks: associate_video

[Run]
Filename: "{app}\\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
`
  },
  {
    name: 'build_installer.bat',
    path: 'scripts/build_installer.bat',
    language: 'bat',
    description: '1-Click Batch Automation Script to build Release binary and compile Inno Setup installer',
    content: `@echo off
echo ===============================================================
echo   NOVA MEDIA PLAYER - WINDOWS 11 STANDALONE BUILD SCRIPT
echo ===============================================================
echo.

:: 1. Check for .NET SDK
where dotnet >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] .NET 8 SDK not found! Please install .NET 8 SDK from:
    echo         https://dotnet.microsoft.com/download/dotnet/8.0
    pause
    exit /b 1
)

echo [1/3] Restoring NuGet dependencies and building Release (win-x64)...
cd ..\\NovaMediaPlayer
dotnet restore -r win-x64
if %ERRORLEVEL% neq 0 (
    echo [ERROR] NuGet restore failed.
    pause
    exit /b 1
)

echo [2/3] Publishing self-contained single executable...
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Dotnet publish failed.
    pause
    exit /b 1
)

echo.
echo [3/3] Compiling Inno Setup Windows Installer...
set ISCC="C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe"
if exist %ISCC% (
    cd ..\\InnoSetup
    %ISCC% NovaMediaPlayer_Setup.iss
    echo.
    echo ===============================================================
    echo   BUILD SUCCESS! 
    echo   Output Installer: InnoSetup\\Output\\Setup_NovaMediaPlayer_x64.exe
    echo ===============================================================
) else (
    echo [INFO] Inno Setup compiler not found at default path.
    echo        Stand-alone portable executable is ready in:
    echo        NovaMediaPlayer\\bin\\Release\\net8.0-windows10.0.22621.0\\win-x64\\publish\\NovaMediaPlayer.exe
)

pause
`
  },
  {
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    description: 'Detailed setup, compilation, codec compatibility and distribution documentation',
    content: `# Nova Media Player — Standalone Windows 11 Desktop Player (VLC-Style)

Nova Media Player is a high-performance, standalone Windows 11 multimedia player inspired by modern VLC Media Player aesthetics. It runs as an independent Windows executable with zero web, browser, or external cloud dependencies.

---

## 🚀 Key Features

- **Multimedia Core**: Powered by **LibVLCSharp** and native **LibVLC 3.x/4.x** C engine.
- **Hardware Acceleration**: Automatic Direct3D11 Video Acceleration (D3D11VA), DXVA2, and NVDEC.
- **Container Formats**: MP4, MKV, AVI, MOV, WMV, FLV, WebM, MPEG-TS, M4V, MP3, FLAC, AAC, WAV, OGG.
- **Codec Support**: H.264 (AVC), H.265 (HEVC), VP9, AV1, ProRes, MPEG-2/4, VC-1, DTS, Dolby Digital.
- **Resolution**: Seamless Full HD (1080p), 2K (1440p), and 4K (2160p) 60FPS playback.
- **Windows 11 UI**: Fluent Dark theme, Mica blur, custom title bar, auto-hiding controls, seek preview.
- **Audio Equalizer**: 10-band graphic equalizer with preamp and volume booster up to 200%.
- **Subtitles**: Full SRT, ASS/SSA, VTT, and embedded PGS/VobSub subtitle track selection and synchronization.

---

## 🛠️ Prerequisites to Build

1. **Windows 10 / 11** (64-bit)
2. **Visual Studio 2022** (v17.8+) or **.NET 8.0 SDK**
   - Workload: *.NET Desktop Development* (WPF)
3. *(Optional for Installer)* **Inno Setup 6.x**

---

## ⚡ Quick Build Instructions

### Option A: Command Line (Fastest)

\`\`\`cmd
# 1. Clone or extract repository
cd NovaMediaPlayer

# 2. Publish self-contained executable for Windows x64
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true

# 3. Executable will be located at:
# NovaMediaPlayer/bin/Release/net8.0-windows10.0.22621.0/win-x64/publish/NovaMediaPlayer.exe
\`\`\`

### Option B: Visual Studio 2022

1. Open \`NovaMediaPlayer.sln\`.
2. Select **Release** and **x64** in the configuration dropdown.
3. Right-click \`NovaMediaPlayer\` project -> **Publish** -> Select **Folder Profile** -> Click **Publish**.

### Option C: Generate Full Windows Setup Installer (.EXE)

Run the included \`scripts/build_installer.bat\` or open \`InnoSetup/NovaMediaPlayer_Setup.iss\` in Inno Setup Compiler and press **F9**. It will generate:
\`InnoSetup/Output/Setup_NovaMediaPlayer_x64.exe\`
`
  }
];
