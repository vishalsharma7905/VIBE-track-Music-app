import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'dart:io';

void main() {
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Music Insights',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MusicPlayerScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class MusicPlayerScreen extends StatefulWidget {
  const MusicPlayerScreen({super.key});

  @override
  State<MusicPlayerScreen> createState() => _MusicPlayerScreenState();
}

class _MusicPlayerScreenState extends State<MusicPlayerScreen> {
  late final WebViewController controller;
  bool _hasPermissions = false;

  @override
  void initState() {
    super.initState();
    _requestPermissions();
    
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x00000000))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (String url) {
            FlutterNativeSplash.remove();
          },
        ),
      )
      ..loadFlutterAsset('assets/web/index.html');
  }

  Future<void> _requestPermissions() async {
    if (Platform.isAndroid) {
      if (await Permission.audio.request().isGranted || 
          await Permission.storage.request().isGranted) {
        setState(() {
          _hasPermissions = true;
        });
      } else {
        setState(() {
          _hasPermissions = true; // Fallback to let the app load even if denied just in case
        });
      }
    } else {
      setState(() { _hasPermissions = true; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: _hasPermissions 
          ? WebViewWidget(controller: controller)
          : const Center(child: Text("Waiting for permissions...")),
      ),
    );
  }
}
