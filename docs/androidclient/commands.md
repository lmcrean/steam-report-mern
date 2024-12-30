# essential commands

```
./gradlew clean 
```
this is the command to clean the project, meaning it will remove all the build files and start fresh

```
./gradlew build
```

this is the command to build the project, meaning it will compile the project and create the apk file

During the build process, the following tasks are executed:

- `clean`: Cleans the build directory.
- `assembleRelease`: Assembles the release version of the app.
- `bundleReleaseAar`: Bundles the release version of the app as an AAR file.
- `bundleRelease`: Bundles the release version of the app.
- `assembleReleaseUnitTest`: Assembles the release version of the app for unit tests.
- `assembleReleaseAndroidTest`: Assembles the release version of the app for Android tests.


# ./gradlew clean build

Here's the complete sequence of what happens during `clean build`:

0. **Project Preparation Phase**
   1. Load settings.gradle.kts
   2. Configure project plugins
   3. Validate project configuration
   // TODO: Currently stuck here - Compose Compiler plugin configuration failing with Kotlin 2.0
   4. Initialize build environment

1. **Clean Phase**
   1. Deletes all build directories
   2. Removes all compiled classes
   3. Removes all resources and temporary files

2. **Compilation Phase**
   1. `compileKotlin` - Compiles Kotlin source code
   2. `compileJava` - Compiles Java source code (if any)
   3. `processResources` - Processes resources files
   4. `classes` - Combines compiled code and resources

3. **Packaging Phase**
   1. `jar` - Creates JAR files
   2. `assemble` - Creates the initial APK structure

4. **Verification Phase**
   1. `check` - Initiates verification process
   2. `test` - Runs unit tests
   3. `lint` - Runs Android lint checks

5. **Final Assembly Phase**
   1. `assembleDebug` - Creates debug APK
   2. `assembleRelease` - Creates release APK

Each main phase must complete successfully before moving to the next phase. If any step fails, the build process stops at that point and reports the error.

# ./gradlew run

this is the command to run the project, meaning it will install the apk file and start the app


1. `assembleRelease` - Creates release APK
2. `installRelease` - Installs the release APK on the connected device
3. `runRelease` - Runs the release APK on the connected device
