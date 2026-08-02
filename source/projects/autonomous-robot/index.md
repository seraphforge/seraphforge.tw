---
title: Autonomous Robot
description: A case study about learning robotics by building, testing, and debugging a physical system.
summary: A case study about learning how software, hardware, sensors, and uncertainty meet inside one robot.
type: project
---

## Why This Project

I started this project because robotics forces theory to meet the physical world. Code that looks correct can still fail because of wiring, power, sensors, timing, or the floor under the robot. I wanted a project that would make those failures visible.

## The Problem

An autonomous robot is not one problem. It is a chain of small uncertain systems: Linux setup, sensor input, motor control, ROS2 communication, mapping, and movement. If one layer is unstable, the whole robot becomes hard to trust.

## My Approach

I worked from the bottom up. I tested hardware and environment setup before trying to make the robot feel autonomous. Each failure became a checkpoint for documenting what I misunderstood about power, communication, or control flow.

## What I Built

I built a prototype path for ROS2 setup, Raspberry Pi integration, LiDAR and sensor experiments, motor testing, and basic movement trials. The robot is still an experiment, not a finished product.

## What I Learned

I learned that robotics rewards patience more than big claims. The useful progress is often in making one layer repeatable, then recording why it failed the last time. Debug notes matter as much as movement.

## Built with

ROS2 · Ubuntu · Raspberry Pi · LiDAR · Motor Control
