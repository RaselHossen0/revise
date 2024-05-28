import 'dart:io';

import 'package:authentication_buttons/authentication_buttons.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'home/HomePage.dart';

void main() {
  const List<String> scopes = <String>[
    'email',
  ];

  GoogleSignIn _googleSignIn = GoogleSignIn(
    // Optional clientId
    clientId: 'your-client_id.apps.googleusercontent.com',
    scopes: scopes,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.pink),
        useMaterial3: true,
      ),
      home: LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  GoogleSignIn _googleSignIn = GoogleSignIn(
    // Optional clientId
    clientId: Platform.isIOS
        ? '127004398121-omjj5hiidh3r0q846t9ir0olqekqg8rp.apps.googleusercontent.com'
        : '127004398121-87dkciepjorphg3gcnnpu0juv5tq75vt.apps.googleusercontent.com',
    scopes: <String>[
      'email',
    ],
  );
  void handleSignIn() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      if (prefs.getString('email') == null) {
        //var res = await _googleSignIn.signIn();
        await prefs.setString('email', 'hrasel2002@gmail.com');
        Navigator.pushAndRemoveUntil(context,
            MaterialPageRoute(builder: (context) {
          return HomePage();
        }), (route) => false);
      } else {
        Navigator.pushAndRemoveUntil(context,
            MaterialPageRoute(builder: (context) {
          return HomePage();
        }), (route) => false);
      }
    } catch (error) {
      print(error);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   title: const Text('Google Sign In'),
      // ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            SizedBox(
              height: 150,
            ),
            Image.asset(
              'assets/logo.png',
              height: 150,
              width: 150,
            ),
            const SizedBox(height: 20),
            Text(
              'Welcome to',
              style: Theme.of(context).textTheme.headline4?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            Text(
              'Revise App',
              style: Theme.of(context).textTheme.headline5?.copyWith(
                  color: Colors.pink,
                  fontWeight: FontWeight.bold,
                  fontSize: 30),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 90),
            AuthenticationButton(
              authenticationMethod: AuthenticationMethod.google,
              onPressed: () {
                handleSignIn();
              },
            )
          ],
        ),
      ),
    );
  }
}
