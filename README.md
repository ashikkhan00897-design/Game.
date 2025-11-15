# CarBattle (Unity Mobile Starter)

A clean starter for a **mobile car battle** game made with Unity. It includes car physics (WheelColliders), mobile controls (virtual joystick + buttons), a simple AI opponent, basic weapon/projectile combat, pooling, health/respawn, and a smooth camera.

> **Tested target**: Unity 2022+ (3D URP recommended)  
> **Mobile**: Android default; iOS also works if you switch the build target.  
> **License**: MIT

---

## Quick Start

1. **Create the Unity project**
   - Open Unity Hub → **New project** → Template **3D (URP)** or **3D Core** → Name: `CarBattle`
   - Close Unity after it generates the baseline (so the folder exists).

2. **Copy this starter into your project**
   - Extract this repo/zip and copy the `Assets/` folder into your Unity project's root (merge & replace scripts if asked).
   - Keep your project's original `ProjectSettings/` (this repo's folder is empty).

3. **Open the project** in Unity and install packages:
   - (Optional) **Cinemachine** for better camera (Window → Package Manager → add "Cinemachine").
   - You can stay with the built‑in Input (this starter uses simple touch/drag; no new InputSystem required).

4. **Create the Scene**
   - `Assets/Scenes/` → create `CarBattle.unity` and open it.
   - Add a **Plane** as the arena (or a ProBuilder mesh), tag obstacles with `Obstacle`.
   - Create an empty GameObject **GameManager** and add `GameManager.cs`.
   - **Main Camera**: add `CameraFollow.cs` and point **Target** to the Player car once you make it.

5. **Build the Player Car**
   - Create an empty → **Car (Player)**.
   - Add a **Rigidbody** (mass 1200, drag 0.02, angular drag 0.4; use interpolation).  
   - Add 4 empty children for wheels: `Wheel_FL`, `Wheel_FR`, `Wheel_RL`, `Wheel_RR`. On each, add a **WheelCollider**.
   - Add meshes for wheels (optional visuals) and a body mesh.
   - Add `CarController.cs` to **Car (Player)** and assign the 4 WheelColliders.
   - Add `Health.cs` to **Car (Player)**.
   - Add `WeaponSystem.cs` and set a `muzzle` Transform in front of the car.
   - Add `MobileHUD.cs` to hook UI controls.
   - Tag `Car (Player)` as `Player`.

6. **Add UI (Mobile)**
   - Create a Canvas (Screen Space Overlay), add `EventSystem`.
   - Add `Joystick` (Image with child handle Image) and attach `Joystick.cs` to the parent.
   - Add two Buttons: **Fire** (attach `FireButton.cs`) and **Drift/Brake** (map to `MobileHUD.cs` if you like).  
   - Drag references into `MobileHUD` (joystick, buttons).

7. **Add an Enemy Car**
   - Duplicate the Player car, rename **Car (Enemy)**.
   - Replace `MobileHUD` with `AIController.cs` on the enemy.
   - Keep `Health.cs`, `WeaponSystem.cs`.
   - In `AIController`, set **target** to the Player.

8. **Hook Camera**
   - Set `CameraFollow.Target = Player` and tune distances.

9. **Press Play** to test. Build for **Android** (File → Build Settings → Android).

---

## Controls (default)
- **Left drag joystick** = steer + throttle
- **Fire button** = shoot projectiles
- **Brake/Drift button** (optional) = stronger brake and higher sideways slip

---

## Folder Layout
```
Assets/
  Scripts/
    Vehicle/        CarController, CameraFollow
    Combat/         WeaponSystem, Projectile, ObjectPool
    AI/             AIController
    Core/           GameManager, Health, Damageable
    UI/             Joystick, FireButton, MobileHUD
  Scenes/           (create CarBattle.unity here)
  Prefabs/          (your prefabs go here)
  Materials/
```

---

## GitHub
- Initialize a repo: `git init && git add . && git commit -m "CarBattle starter"`
- Push to GitHub: create a new repo → add remote → `git push -u origin main`

---

## Notes
- WheelCollider tuning matters for "real vibe": play with `suspensionDistance`, `spring`, `damper`, `forwardFriction`/`sidewaysFriction` stiffness.
- Physics timestep: Edit → Project Settings → Time → Fixed Timestep `0.02` (50Hz) is a good start.
- For more realism, consider adding skidmarks, engine audio, and Cinemachine FreeLook.

Enjoy!
