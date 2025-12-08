<!-- SYNC IMPACT REPORT:
Version change: N/A → 1.0.0
Modified principles: N/A (new constitution)
Added sections: All principles and sections (new constitution)
Removed sections: N/A
Templates requiring updates:
- .specify/templates/plan-template.md: ⚠ pending
- .specify/templates/spec-template.md: ⚠ pending
- .specify/templates/tasks-template.md: ⚠ pending
- .specify/templates/commands/*.md: ⚠ pending
Follow-up TODOs: None
-->

# Physical AI & Humanoid Robotics Book + Integrated RAG Chatbot Constitution

## Core Principles

### Technical Accuracy
All robotics content must align with official ROS/Gazebo/Isaac documentation; All claims must match 2024–2025 robotics best practices; Code examples must be runnable and validated

### Clear Engineering Pedagogy
Content must follow consistent structure across modules; Writing style must be concise technical textbook tone; Each module provides overview, theory, code, diagrams, and exercises

### Consistent Structure
All modules follow the same structure; Docusaurus + Spec-Kit formatting only; Content must be organized in clear, logical progression

### Validated Code Examples
All code examples must be runnable and validated; No speculative or non-verifiable robotics claims; Code must match official documentation standards

### RAG System Integration
Chatbot answers must cite book sections and support text-selection queries; RAG system must perform accurate retrieval and grounded answers; FastAPI backend with OpenAI Agents/ChatKit integration

### Multi-Module Architecture
Deliver full multi-module book (ROS 2 → Simulation → Isaac → VLA → Capstone); Capstone demonstrates full pipeline: voice → plan → navigation → perception → manipulation

## Technology Stack and Deployment Standards
Use Docusaurus for documentation, FastAPI for backend, OpenAI Agents/ChatKit for chatbot, Neon Postgres + Qdrant Cloud for data storage; Deploy via GitHub Pages; Follow 2024-2025 robotics best practices

## Development Workflow
All content must align with official ROS/Gazebo/Isaac documentation; Code examples must be validated before merging; All claims must be verifiable and non-speculative

## Governance
Constitution supersedes all other practices; Amendments require documentation and approval; All PRs/reviews must verify compliance with robotics documentation standards; Complexity must be justified

**Version**: 1.0.0 | **Ratified**: 2025-12-07 | **Last Amended**: 2025-12-07
