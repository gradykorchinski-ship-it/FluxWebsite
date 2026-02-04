---
title: "Wi-Fi / Bluetooth issues"
description: "Troubleshooting connectivity."
---

# Wi-Fi & Bluetooth Troubleshooting

## Wi-Fi
If your Wi-Fi is not detected:
1. Check if `rfkill` is blocking it:
   ```bash
   rfkill list
   ```
2. Unblock if needed:
   ```bash
   rfkill unblock wifi
   ```

## Bluetooth
Ensure the service is running:
```bash
sudo systemctl status bluetooth
sudo systemctl start bluetooth
```
