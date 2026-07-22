import type {
  AppRegion,
  CodeArtifact,
  CodeTarget,
  ColorScheme,
  ScreenSpec,
  ScreenElement,
} from '@/types/builder';

export function generateCode(
  regions: AppRegion[],
  target: CodeTarget,
  colorScheme: ColorScheme,
  appName: string,
): CodeArtifact[] {
  switch (target) {
    case 'react-native':
      return generateReactNative(regions, colorScheme, appName);
    case 'flutter':
      return generateFlutter(regions, colorScheme, appName);
    case 'swift':
      return generateSwift(regions, colorScheme, appName);
    case 'kotlin':
      return generateKotlin(regions, colorScheme, appName);
    case 'web':
      return generateWeb(regions, colorScheme, appName);
  }
}

function specFromRegion(region: AppRegion): ScreenSpec {
  return region.spec;
}

function generateReactNative(
  regions: AppRegion[],
  colorScheme: ColorScheme,
  appName: string,
): CodeArtifact[] {
  const artifacts: CodeArtifact[] = [];

  artifacts.push({
    filename: 'App.tsx',
    language: 'typescript',
    target: 'react-native',
    content: `import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './theme';
${regions
  .filter((r) => r.status === 'complete')
  .map((r) => `import ${screenVar(r.region_name)} from './screens/${r.region_name.replace(/\s+/g, '')}';`)
  .join('\n')}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="${regions[0]?.region_name ?? 'Home'}">
${regions
  .filter((r) => r.status === 'complete')
  .map((r) => `          <Stack.Screen name="${r.region_name}" component={${screenVar(r.region_name)}} />`)
  .join('\n')}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}`,
  });

  artifacts.push({
    filename: 'theme.ts',
    language: 'typescript',
    target: 'react-native',
    content: `export const theme = {
  colors: {
    primary: '${colorScheme.primary}',
    secondary: '${colorScheme.secondary}',
    accent: '${colorScheme.accent}',
    background: '${colorScheme.background}',
    surface: '${colorScheme.surface}',
    text: '${colorScheme.text}',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
};`,
  });

  for (const region of regions.filter((r) => r.status === 'complete')) {
    const spec = specFromRegion(region);
    artifacts.push({
      filename: `screens/${region.region_name.replace(/\s+/g, '')}.tsx`,
      language: 'typescript',
      target: 'react-native',
      content: generateRNScreen(spec, region.region_name, colorScheme),
    });
  }

  return artifacts;
}

function generateRNScreen(spec: ScreenSpec, screenName: string, cs: ColorScheme): string {
  const elements = spec.elements.map((el) => rnElement(el, cs)).join('\n      ');
  return `import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function ${screenVar(screenName)}({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>${spec.name}</Text>
      ${elements}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '${cs.background}', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '${cs.text}', marginBottom: 16 },
});`;
}

function rnElement(el: ScreenElement, cs: ColorScheme): string {
  switch (el.kind) {
    case 'header':
      return `<Text style={{ fontSize: 24, fontWeight: 'bold', color: '${cs.text}', marginBottom: 8 }}>${el.label ?? ''}</Text>`;
    case 'text':
      return `<Text style={{ fontSize: 14, color: '${cs.text}', marginBottom: 8 }}>${el.label ?? ''}</Text>`;
    case 'button':
      return `<TouchableOpacity style={{ backgroundColor: '${cs.primary}', borderRadius: 12, paddingVertical: 12, marginBottom: 8 }}>\n        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>${el.label ?? ''}</Text>\n      </TouchableOpacity>`;
    case 'input':
      return `<TextInput placeholder="${el.placeholder ?? ''}" style={{ backgroundColor: '${cs.surface}', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8, borderWidth: 1, borderColor: '${cs.secondary}40' }} />`;
    case 'stat':
      return `<View style={{ backgroundColor: '${cs.surface}', borderRadius: 12, padding: 12, marginBottom: 8 }}>\n        <Text style={{ fontSize: 12, color: '${cs.text}99' }}>${el.label ?? ''}</Text>\n        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '${cs.primary}' }}>${el.value ?? ''}</Text>\n      </View>`;
    case 'card':
      return `<View style={{ backgroundColor: '${cs.surface}', borderRadius: 12, padding: 12, marginBottom: 8 }}>\n        <Text style={{ fontWeight: '600', color: '${cs.text}' }}>${el.label ?? ''}</Text>\n        ${el.value ? `<Text style={{ fontSize: 12, color: '${cs.text}99' }}>${el.value}</Text>` : ''}\n      </View>`;
    case 'image':
      return `<View style={{ height: 112, borderRadius: 12, backgroundColor: '${cs.primary}30', marginBottom: 8 }} />`;
    case 'avatar':
      return `<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '${cs.surface}', borderRadius: 12, padding: 10, marginBottom: 8 }}>\n        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '${cs.secondary}', justifyContent: 'center' }}>\n          <Text style={{ color: '#fff', fontWeight: 'bold' }}>${(el.label ?? 'U').charAt(0).toUpperCase()}</Text>\n        </View>\n        <Text style={{ marginLeft: 12, color: '${cs.text}' }}>${el.label ?? ''}</Text>\n      </View>`;
    default:
      return '';
  }
}

function generateFlutter(
  regions: AppRegion[],
  colorScheme: ColorScheme,
  appName: string,
): CodeArtifact[] {
  return [
    {
      filename: 'main.dart',
      language: 'dart',
      target: 'flutter',
      content: `import 'package:flutter/material.dart';
import 'theme.dart';

void main() => runApp(${appName.replace(/[^a-zA-Z]/g, '')}App());

class ${appName.replace(/[^a-zA-Z]/g, '')}App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${appName}',
      theme: AppTheme.light,
      home: ${screenVar(regions[0]?.region_name ?? 'Home')}(),
    );
  }
}`,
    },
    {
      filename: 'theme.dart',
      language: 'dart',
      target: 'flutter',
      content: `import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData light = ThemeData(
    primaryColor: Color(0xFF${colorScheme.primary.replace('#', '')}),
    colorScheme: ColorScheme.light(
      primary: Color(0xFF${colorScheme.primary.replace('#', '')}),
      secondary: Color(0xFF${colorScheme.secondary.replace('#', '')}),
      surface: Color(0xFF${colorScheme.surface.replace('#', '')},
    ),
    scaffoldBackgroundColor: Color(0xFF${colorScheme.background.replace('#', '')}),
  );
}`,
    },
  ];
}

function generateSwift(
  regions: AppRegion[],
  colorScheme: ColorScheme,
  appName: string,
): CodeArtifact[] {
  return [
    {
      filename: `${appName.replace(/[^a-zA-Z]/g, '')}App.swift`,
      language: 'swift',
      target: 'swift',
      content: `import SwiftUI

@main
struct ${appName.replace(/[^a-zA-Z]/g, '')}App: App {
    var body: some Scene {
        WindowGroup {
            ${screenVar(regions[0]?.region_name ?? 'Home')}View()
        }
    }
}`,
    },
    {
      filename: `${screenVar(regions[0]?.region_name ?? 'Home')}View.swift`,
      language: 'swift',
      target: 'swift',
      content: `import SwiftUI

struct ${screenVar(regions[0]?.region_name ?? 'Home')}View: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 12) {
                    Text("${regions[0]?.region_name ?? 'Home'}")
                        .font(.largeTitle.bold())
${regions[0]?.spec.elements
  .filter((e) => e.kind === 'text')
  .map((e) => `                    Text("${e.label ?? ''}")\n                        .font(.body)`)
  .join('\n')}
                }
                .padding()
            }
            .background(Color(uiColor: UIColor(red: ${parseInt(colorScheme.background.slice(1, 3), 16) / 255}, green: ${parseInt(colorScheme.background.slice(3, 5), 16) / 255}, blue: ${parseInt(colorScheme.background.slice(5, 7), 16) / 255}, alpha: 1)))
        }
    }
}`,
    },
  ];
}

function generateKotlin(
  regions: AppRegion[],
  colorScheme: ColorScheme,
  appName: string,
): CodeArtifact[] {
  return [
    {
      filename: 'MainActivity.kt',
      language: 'kotlin',
      target: 'kotlin',
      content: `package com.appforge.${appName.toLowerCase().replace(/[^a-z]/g, '')}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = lightColorScheme(
                    primary = Color(0xFF${colorScheme.primary.replace('#', '')}),
                    secondary = Color(0xFF${colorScheme.secondary.replace('#', '')}),
                )
            ) {
                ${screenVar(regions[0]?.region_name ?? 'Home')}Screen()
            }
        }
    }
}

@Composable
fun ${screenVar(regions[0]?.region_name ?? 'Home')}Screen() {
    Column(modifier = Modifier.padding(16.dp)) {
        Text("${regions[0]?.region_name ?? 'Home'}", style = MaterialTheme.typography.headlineLarge)
    }
}`,
    },
  ];
}

function generateWeb(
  regions: AppRegion[],
  colorScheme: ColorScheme,
  appName: string,
): CodeArtifact[] {
  return [
    {
      filename: 'index.html',
      language: 'html',
      target: 'web',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${appName}</title>
  <style>
    :root {
      --primary: ${colorScheme.primary};
      --secondary: ${colorScheme.secondary};
      --accent: ${colorScheme.accent};
      --bg: ${colorScheme.background};
      --surface: ${colorScheme.surface};
      --text: ${colorScheme.text};
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui; background: var(--bg); color: var(--text); }
    .screen { max-width: 420px; margin: 0 auto; min-height: 100vh; padding: 16px; }
    h1 { font-size: 24px; margin-bottom: 16px; }
    .btn { display: block; width: 100%; padding: 12px; background: var(--primary); color: #fff; border: none; border-radius: 12px; font-weight: 600; margin-bottom: 8px; cursor: pointer; }
    .input { width: 100%; padding: 10px 12px; background: var(--surface); border: 1px solid var(--secondary)40; border-radius: 12px; margin-bottom: 8px; }
    .card { background: var(--surface); border-radius: 12px; padding: 12px; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="screen">
    <h1>${regions[0]?.region_name ?? 'Home'}</h1>
${regions[0]?.spec.elements
  .map((el) => webElement(el))
  .filter(Boolean)
  .join('\n')}
  </div>
</body>
</html>`,
    },
  ];
}

function webElement(el: ScreenElement): string {
  switch (el.kind) {
    case 'button':
      return `    <button class="btn">${el.label ?? ''}</button>`;
    case 'input':
      return `    <input class="input" placeholder="${el.placeholder ?? ''}" />`;
    case 'card':
      return `    <div class="card">${el.label ?? ''}</div>`;
    case 'stat':
      return `    <div class="card"><small>${el.label ?? ''}</small><br/><strong style="font-size:20px;color:var(--primary)">${el.value ?? ''}</strong></div>`;
    case 'text':
      return `    <p>${el.label ?? ''}</p>`;
    case 'header':
      return `    <h1>${el.label ?? ''}</h1>`;
    default:
      return '';
  }
}

function screenVar(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '').replace(/^./, (c) => c.toUpperCase()) || 'Home';
}

export function syntaxHighlight(content: string, language: string): string {
  const keywords: Record<string, string[]> = {
    typescript: ['import', 'export', 'default', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'extends', 'implements', 'new', 'async', 'await', 'from'],
    dart: ['import', 'class', 'extends', 'void', 'int', 'double', 'String', 'bool', 'final', 'const', 'var', 'return', 'if', 'else', 'Widget', 'Build', 'context'],
    swift: ['import', 'struct', 'class', 'var', 'let', 'func', 'return', 'if', 'else', 'for', 'while', 'in', 'some', 'View', 'body'],
    kotlin: ['import', 'class', 'fun', 'val', 'var', 'override', 'return', 'if', 'else', 'for', 'while', 'in', 'Composable', 'remember'],
  };
  const langKeywords = keywords[language] ?? [];
  let highlighted = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  for (const kw of langKeywords) {
    const re = new RegExp(`\\b(${kw})\\b`, 'g');
    highlighted = highlighted.replace(re, '<span class="syn-kw">$1</span>');
  }
  highlighted = highlighted.replace(/(['"`])((?:\\.|(?!\1).)*?)\1/g, '<span class="syn-str">$1$2$1</span>');
  highlighted = highlighted.replace(/\/\/(.*)$/gm, '<span class="syn-cmt">//$1</span>');
  highlighted = highlighted.replace(/(\b\d+\.?\d*\b)/g, '<span class="syn-num">$1</span>');
  return highlighted;
}
