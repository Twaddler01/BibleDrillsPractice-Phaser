import 'dart:io';
import 'package:phaser_flutter_game/asset_helper.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:shelf_static/shelf_static.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;

void logFilesInDirectory(Directory directory) {
  try {
    final files = directory.listSync(recursive: true);
    for (var file in files) {
      print('File: ${file.path}');
    }
  } catch (e) {
    print('Error listing files: $e');
  }
}

Middleware cors() {
  return (Handler innerHandler) {
    return (Request request) async {
      final response = await innerHandler(request);
      return response.change(headers: {
        'Access-Control-Allow-Origin': '*',  // Allows any domain to access the resource
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',  // Allowed methods
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',  // Allowed headers
      });
    };
  };
}

Future<void> startServer() async {
  // Get the app's temporary directory where assets were copied
  final tempDir = await getTemporaryDirectory();
  final tempPath = tempDir.path;

  // Path to the 'webgame' directory inside the temporary directory
  final targetDirPath = path.join(tempPath, 'webgame');

  // Ensure the webgame directory exists in the temporary directory
  final targetDir = Directory(targetDirPath);
  if (!await targetDir.exists()) {
    print('Webgame directory not found. Please copy assets first.');
    return;
  }

  // Serve the static files from the 'webgame' directory in the temp directory
  final handler = const Pipeline()
      .addMiddleware(logRequests())
      .addMiddleware(cors())  // Add the CORS middleware here
      .addHandler(createStaticHandler(targetDirPath, defaultDocument: 'index.html'));

  final server = await shelf_io.serve(handler, InternetAddress.loopbackIPv4, 8080);
  server.autoCompress = true;

  logFilesInDirectory(targetDir);

  print('Serving at http://${server.address.host}:${server.port}');
}

void main() async {
  await copyAssets();  // Make sure assets are copied before starting the server
  await startServer();
}