---
title: "Create a bootable USB"
description: "How to flash the ISO."
---

# Create a Bootable USB

## Windows
1. Download **Rufus**.
2. Select your USB drive.
3. Select the FluxLinux ISO.
4. Click Start.

## Linux / macOS
1. Use **Balena Etcher** (simplest).
2. Or use `dd` command:
   ```bash
   sudo dd if=fluxlinux.iso of=/dev/sdX bs=4M status=progress
   ```
