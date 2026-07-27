---
title: ROS2 Topic Communication
description: ROS2 publish / subscribe topic 通信 を記録する Lab note。
---

# ROS2 Topic Communication

- **状態:** 進行中
- **Date:** 2026-06-20
- **Category:** Robotics

## Purpose

**ROS2** nodes が topics を通してどう通信するかを理解し、autonomous robot prototype にどう使えるか確認します。

## Setup

- ROS2 environment
- Linux workstation または Raspberry Pi
- Example publisher node
- Example subscriber node

## Steps

1. simple publisher を作成する。
2. topic を listen する subscriber を作成する。
3. topic list と message type を確認する。
4. message frequency と logging をテストする。

## Result

基本的な publish / subscribe flow が動作し、sensors、control logic、robot state をつなぐ考え方が明確になりました。

## メモ

topic names は重要です。topic names と message types が不一致だと debug が難しくなります。

## Next Step

topic flow を sensor input と motor control experiments に接続します。
