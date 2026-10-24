# PrismGo on Google Play: internal testing

Goal: the client's requesters and HODs install PrismGo from the Play Store on their Android phones and get updates automatically, before the public release.

**Why internal testing:** up to 100 testers chosen by email, builds are available minutes after upload, and there is no full Play review. Developer account: **BlackPrism** (organisation account `4800665863719491026`), so the 12-tester / 14-day closed test that new personal accounts need before production does not apply.

Owners: **BlackPrism** (account, keys, declarations), **Dev** (builds and uploads), **Client** (tester list).

## Steps

### 1. Upload key (BlackPrism, once, 10 min)

Play signs the app for users with a key Google keeps (Play App Signing). We sign uploads with our own **upload key**. If it is lost, Google can reset it, but that takes days, so keep a backup.

```bash
keytool -genkey -v -keystore ~/keys/prismgo-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

- Choose a strong password; save the `.jks` file and the password in the BlackPrism password manager.
- Copy `apps/mobile/android/key.properties.example` to `apps/mobile/android/key.properties` and fill it in. Both the `.jks` and `key.properties` are kept out of git.

### 2. Create the app (BlackPrism, 5 min)

Play Console → **Create app**:

| Field            | Value                                                           |
| ---------------- | --------------------------------------------------------------- |
| App name         | PrismGo                                                         |
| Default language | English (India) – en-IN                                         |
| App or game      | App                                                             |
| Free or paid     | Free                                                            |
| Declarations     | Developer Program Policies, US export laws (BlackPrism accepts) |

### 3. Testers (Client → BlackPrism)

1. Client sends the **Gmail / Google account** of each tester (the account signed in to the Play Store on their phone). Start with the UAT group: a requester, their HOD, the Transport Manager.
2. Play Console → PrismGo → **Testing → Internal testing → Testers** → Create email list "PrismGo UAT" → add the emails → set the feedback email (e.g. `admin@blackprism.in`) → Save.
3. Each tester must also exist in PrismGo as a user with the **same mobile number** they log in with (Admin → Users).

### 4. First release (Dev, after steps 1–2)

```bash
cd apps/mobile
flutter build appbundle --release --dart-define=API_ORIGIN=https://api.prismgo.blackprism.in
```

Play Console → **Internal testing → Create new release**:

- Accept **Play App Signing** (Google-generated app signing key) when asked on the first upload.
- Upload `build/app/outputs/bundle/release/app-release.aab`.
- Release name `1.0.0 (1)`, notes "UAT build: requests, approvals, live tracking".
- **Review release → Start rollout to Internal testing**.

If the rollout is blocked, Play lists the setup tasks it needs (Dashboard). The usual ones, with answers:

| Task                                 | Answer                                                                                                                                                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Privacy policy                       | URL needed: the app stores names, phone numbers and trip details. To do: publish a policy page (e.g. `https://prismgo.blackprism.in/privacy`)                                                                                     |
| App access                           | All functionality needs login: phone number + 6-digit WhatsApp code. Give Play a test number and how to get the code                                                                                                              |
| Ads                                  | No ads                                                                                                                                                                                                                            |
| Content rating                       | Questionnaire: business/productivity app, no objectionable content                                                                                                                                                                |
| Target audience                      | 18 and over                                                                                                                                                                                                                       |
| Data safety                          | Collected: name, phone number, email (optional), app interactions (requests); device ID (push token). Purpose: app functionality, account management. Encrypted in transit; not shared or sold; deletion: on request to the admin |
| Government / financial / health apps | No                                                                                                                                                                                                                                |

### 5. Testers install (Client)

1. BlackPrism sends the **opt-in link** (Internal testing → Testers → Copy link).
2. Tester opens it **on the Android phone**, signed in with the listed Google account → **Accept invite** → **Download it on Google Play**.
3. Open PrismGo → mobile number → code from WhatsApp.

Anyone who sideloaded the earlier UAT APK must uninstall it first (it is signed with a different key).

### 6. Updates (Dev)

1. Bump `version` in `apps/mobile/pubspec.yaml`: the number after `+` must increase every upload (`1.0.0+2`, `1.0.0+3`, …).
2. Build the app bundle as above, create a new internal testing release, roll out.
3. Testers get the update from the Play Store (automatic, or Play Store → Manage apps).

### 7. After the client approves the demo

- **Production** (public, or a private listing for the client's staff): full store listing (icon 512×512, feature graphic 1024×500, at least 2 phone screenshots, short and full description) and Play review (a few days).
- **Google Maps key**: when it is restricted to the Android app, add the **app signing** SHA-1 from Play Console → Setup → App integrity (not the upload key's).
- **iOS**: Apple Developer account, APNs key in Firebase, TestFlight.

Push notifications (Firebase) need no change for Play signing.

## Checklist

- [ ] BlackPrism: upload key created and backed up; `key.properties` filled in
- [ ] BlackPrism: PrismGo app created in Play Console
- [ ] Client: tester Google accounts sent; BlackPrism: email list created
- [ ] Testers added as PrismGo users with their mobile numbers
- [ ] BlackPrism: privacy policy URL
- [ ] Dev: first app bundle uploaded, Play App Signing accepted, rolled out
- [ ] BlackPrism: setup tasks Play asks for (table above)
- [ ] Testers: opt-in link opened, app installed, logged in
