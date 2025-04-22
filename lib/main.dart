import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:phaser_flutter_game/asset_helper.dart';
import 'local_server.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await copyAssets();
  await startServer(); // Start server before launching app

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: WebGameScreen(),
    );
  }
}

class WebGameScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: InAppWebView(
          initialUrlRequest: URLRequest(
            url: WebUri('http://127.0.0.1:8080'), // ← important for emulator
          ),
          initialSettings: InAppWebViewSettings(
              useShouldOverrideUrlLoading: true,
              javaScriptEnabled: true,
            ),
          onWebViewCreated: (controller) {
            print('WebView created');
          },
        ),
      ),
    );
  }
}








/*import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:phaser_flutter_game/local_server.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final server = LocalServer();
  await server.start();

  runApp(MyApp(serverPort: server.port));
}

class MyApp extends StatelessWidget {
  final int serverPort;

  const MyApp({required this.serverPort});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Phaser Game',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: GameScreen(port: serverPort),
    );
  }
}

class GameScreen extends StatelessWidget {
  final int port;

  const GameScreen({required this.port});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Phaser Game')),
      body: InAppWebView(
        initialUrlRequest: URLRequest(
          url: WebUri("http://localhost:$port/index.html"),
        ),
        onConsoleMessage: (controller, message) {
          print('Console: ${message.message}');
        },
      ),
    );
  }
}
*/