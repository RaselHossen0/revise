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
    clientId: 'your-client_id.apps.googleusercontent.com',
    scopes: <String>[
      'email',
    ],
  );
  void handleSignIn() async {
    try {
      //await _googleSignIn.signIn();
    } catch (error) {
      print(error);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Google Sign In'),
      ),
      body: Column(
        children: [
          Text(
            'Welcome to',
            style: Theme.of(context).textTheme.headline4,
          ),
          Center(
            child: ElevatedButton(
              onPressed: () async {
                SharedPreferences prefs = await SharedPreferences.getInstance();
                if (prefs.getString('email') == null)
                  prefs.setString('email', 'hrasel2002@gmail.com');
                Navigator.push(context, MaterialPageRoute(builder: (context) {
                  return HomePage();
                }));
                // Trigger the Google Sign In process
                //handleSignIn();
              },
              child: const Text('Sign in with Google'),
            ),
          ),
        ],
      ),
    );
  }
}
