import 'dart:io';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;

Future<void> copyAssets() async {
  // Get the app's temporary directory
  final tempDir = await getTemporaryDirectory();
  final tempPath = tempDir.path;

  // Path to the 'webgame' directory inside 'assets'
  //final assetDirPath = 'public';

  // Ensure the webgame directory exists in the temporary directory
  final targetDir = Directory(path.join(tempPath, 'webgame'));
  if (!await targetDir.exists()) {
    await targetDir.create(recursive: true);
  }

  // List all the assets in the 'webgame' directory from the app's assets
  final manifest = await rootBundle.loadString('AssetManifest.json');
  final assetPaths = (RegExp(r'\"(public/[^"]+)\"')
          .allMatches(manifest)
          .map((match) => match.group(1))
          .toList());

  // Copy each file from assets to the target directory
  for (var asset in assetPaths) {
    final data = await rootBundle.load(asset!);
    final fileName = path.basename(asset);
    final file = File(path.join(targetDir.path, fileName));
    await file.writeAsBytes(data.buffer.asUint8List());
  }

  print('Assets copied to: $tempPath/webgame');
}