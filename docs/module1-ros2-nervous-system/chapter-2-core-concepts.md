---
sidebar_position: 3
---

# Chapter 2: Core Concepts of ROS 2 Architecture

## Understanding the ROS 2 Architecture

The ROS 2 architecture is built around a distributed system design that enables multiple processes to communicate and coordinate effectively. This architecture is fundamental to how ROS 2 functions as the nervous system of humanoid robots.

## Key Architectural Components

### Nodes
Nodes are the fundamental building blocks of any ROS 2 application. Each node performs a specific task and communicates with other nodes through various communication patterns.

**Characteristics of Nodes:**
- Encapsulate specific functionality (e.g., sensor processing, motion control, perception)
- Communicate with other nodes through topics, services, or actions
- Can be written in different programming languages (C++, Python, etc.)
- Can run on the same or different machines

### Topics and Message Passing
Topics provide a publish-subscribe communication model where nodes can publish data to named topics and other nodes can subscribe to those topics.

**Key aspects of Topics:**
- **Publisher-Subscriber Pattern**: Publishers send messages without knowing subscribers
- **Decoupling**: Publishers and subscribers are temporally and spatially decoupled
- **Data Types**: Each topic has a specific message type that defines the data structure
- **Quality of Service (QoS)**: Configurable policies for reliability, durability, and performance

### Services
Services provide a request-response communication pattern, similar to a traditional client-server model.

**Service Characteristics:**
- Synchronous communication
- Request-response pattern
- One-to-one communication
- Request and response data types are defined in service definition files

### Actions
Actions are goal-oriented communication patterns that include feedback and status updates during execution.

**Action Features:**
- Goal request with feedback during execution
- Result upon completion
- Ability to cancel ongoing actions
- Ideal for long-running tasks like navigation or manipulation

## Communication Patterns in Humanoid Robotics

### Sensor Data Distribution
In humanoid robots, various sensors continuously publish data to topics:
- Camera nodes publish image data
- IMU nodes publish orientation and acceleration data
- Joint encoder nodes publish position and velocity data
- Force/torque sensors publish contact information

### Control Command Propagation
Control systems subscribe to sensor topics and publish commands:
- Perception nodes subscribe to camera data and publish object detections
- Path planning nodes subscribe to sensor data and publish trajectories
- Motor control nodes subscribe to trajectory data and publish actuator commands

### Coordination and Synchronization
Multiple subsystems need to coordinate their activities:
- Walking pattern generators coordinate with balance controllers
- Vision systems coordinate with manipulation systems
- Planning modules coordinate with execution modules

## Practical Robotics Examples

### Example 1: Head Tracking
A humanoid robot tracking a moving object involves:
1. Camera node publishes image data to `/camera/image_raw`
2. Object detection node subscribes to image data and publishes object positions to `/detected_objects`
3. Head control node subscribes to object positions and publishes head joint commands to `/head_controller/commands`

### Example 2: Walking Control
Humanoid walking involves:
1. Walking pattern generator node calculates desired foot positions
2. Balance controller node processes IMU data and adjusts walking parameters
3. Joint control nodes execute the calculated trajectories
4. Feedback nodes monitor actual joint positions and report deviations

### Example 3: Speech Interaction
Voice interaction system includes:
1. Audio input node captures speech and publishes to `/audio_input`
2. Speech recognition node processes audio and publishes text to `/recognized_speech`
3. Natural language processing node interprets commands and publishes actions
4. Behavior execution nodes carry out the requested actions

## Quality of Service (QoS) in Robotics

QoS settings are crucial for reliable robot operation:
- **Reliability**: Ensuring critical control messages are delivered
- **Durability**: Whether messages should persist for late-joining subscribers
- **History**: How many messages to keep for new subscribers
- **Deadline**: Maximum time between consecutive messages

## Lifecycle Management

ROS 2 provides lifecycle management for nodes that need to transition through different states:
- Unconfigured → Inactive → Active → Finalized
- Enables proper initialization, configuration, and shutdown procedures
- Critical for safety in humanoid robotics applications

## Summary

Understanding these core concepts is essential for developing robust humanoid robot applications. The distributed architecture of ROS 2 allows for modular, maintainable, and scalable robot software systems that can handle the complexity of humanoid robotics.

In the next chapter, we'll explore the tools and implementation aspects of ROS 2 development for humanoid robotics.