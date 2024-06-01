import 'package:authentication_buttons/authentication_buttons.dart';
import 'package:firebase_auth/firebase_auth.dart' as auth;
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'firebase_options.dart';
import 'home/HomePage.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
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
  // GoogleSignIn _googleSignIn = GoogleSignIn(
  //   serverClientId:
  //       '127004398121-87dkciepjorphg3gcnnpu0juv5tq75vt.apps.googleusercontent.com',
  //   // Optional clientId
  //   clientId: Platform.isIOS
  //       ? '127004398121-omjj5hiidh3r0q846t9ir0olqekqg8rp.apps.googleusercontent.com'
  //       : null,
  //   scopes: <String>[
  //     'email',
  //   ],
  // );

  void handleSignIn() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      if (prefs.getString('email') == null) {
        final _auth = auth.FirebaseAuth.instance;
        auth.UserCredential userCredential = await _auth.signInWithProvider(
          auth.GoogleAuthProvider(),
        );
        auth.User? user = userCredential.user;
        prefs.setString('email', user!.email!);

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
      showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Error'),
              content: const Text('An error occurred while signing in'),
              actions: <Widget>[
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          });
      print(error);
    }
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    checkPreviousLogin();
  }

  checkPreviousLogin() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('email') != null) {
      Navigator.pushAndRemoveUntil(context,
          MaterialPageRoute(builder: (context) {
        return HomePage();
      }), (route) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   toolbarHeight: 0,
      //   forceMaterialTransparency: true,
      //   systemOverlayStyle: SystemUiOverlayStyle(
      //     statusBarColor: Colors.transparent,
      //     statusBarIconBrightness: Brightness.dark,
      //     systemNavigationBarColor: Colors.pink[50],
      //   ),
      // ),
      body: SizedBox(
        width: double.infinity,
        height: MediaQuery.of(context).size.height,
        child: Stack(
          children: [
            Image.asset(
              'assets/login.png',
              width: double.infinity,
              height: double.infinity,
              fit: BoxFit.cover,
            ),
            Center(
              child: Container(
                width: MediaQuery.of(context).size.width * 0.9,
                height: MediaQuery.of(context).size.height * 0.6,
                margin: const EdgeInsets.symmetric(horizontal: 20),
                padding: const EdgeInsets.symmetric(horizontal: 26),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  // color: Colors.white.withOpacity(1.0),
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.white.withOpacity(0.9),
                      Colors.white.withOpacity(0.6),
                    ],
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Image.asset(
                        'assets/logo2.png',
                        height: 150,
                        width: 150,
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'Welcome!',
                        style: Theme.of(context).textTheme.headline4?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                        textAlign: TextAlign.center,
                      ),
                      //const SizedBox(height: 20),
                      // Text(
                      //   'Revise App',
                      //   style: Theme.of(context).textTheme.headline5?.copyWith(
                      //       color: Colors.pink,
                      //       fontWeight: FontWeight.bold,
                      //       fontSize: 30),
                      //   textAlign: TextAlign.center,
                      // ),
                      const SizedBox(height: 60),
                      AuthenticationButton(
                        authenticationMethod: AuthenticationMethod.google,
                        onPressed: () {
                          handleSignIn();
                        },
                      )
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
