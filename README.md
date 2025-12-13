# Terraform Associate (003) Exam Simulator

An AI-powered certification practice engine that generates full-length, timed practice tests for the HashiCorp Terraform Associate (003) exam. It simulates the real exam format (57 questions, 60 minutes) and strictly adheres to official topic weightings.

## Features

- **Realistic Exam Format**: 57 questions, 60-minute timer, 70% passing score.
- **Accurate Topic Weighting**: Questions are generated based on official HashiCorp exam objectives (e.g., 25% Workflow, 13% Modules).
- **AI-Generated Content**: Uses Google Gemini to create unique scenarios, HCL code snippets, and explanations every time.
- **Detailed Analytics**: Dashboard tracks your average score, pass rate, and performance by topic.
- **Review Mode**: Deep dive into correct/incorrect answers with explanations.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **Google Gemini API Key** (Get one at [aistudio.google.com](https://aistudio.google.com/))

## Installation & Setup

1.  **Download/Clone the repository** to your local machine.

2.  **Install Dependencies**:
    Open your terminal in the project root and run:
    ```bash
    npm install
    ```

3.  **Configure API Key**:
    Create a file named `.env` in the root directory and add your Google Gemini API key:
    ```env
    API_KEY=your_actual_api_key_here
    ```

## Running the Application

1.  **Start the Development Server**:
    ```bash
    npm run dev
    ```

2.  **Open in Browser**:
    The terminal will show a local URL (usually `http://localhost:5173`). Click it or copy-paste it into your browser.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, Lucide React
- **Build Tool**: Vite
- **AI Integration**: Google GenAI SDK (Gemini 2.5 Flash)
- **Language**: TypeScript

## Troubleshooting

- **API Errors**: If the exam fails to generate, check your browser console. Ensure your API Key is valid and has sufficient quota.
- **Blank Screen**: Ensure you ran `npm install` successfully and that there are no errors in the terminal running `npm run dev`.
