# Aura - Sustainability Copilot: Project Explanation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Purpose and Goals](#purpose-and-goals)
3. [Technology Stack](#technology-stack)
4. [Architecture and Design](#architecture-and-design)
5. [Core Components](#core-components)
6. [Data Flow](#data-flow)
7. [AI Integration](#ai-integration)
8. [Design System](#design-system)
9. [Project Structure](#project-structure)
10. [Development Guide](#development-guide)

---

## Project Overview

**Aura** is an AI-powered sustainability chatbot application designed to help users make environmentally conscious decisions. Built with modern web technologies, it provides an interactive chat interface where users can ask questions about sustainability topics and receive practical, solution-oriented advice through natural conversations.

### Key Features
- 🌱 AI-powered sustainability guidance
- 💬 Interactive chat interface with markdown support
- 📸 Image upload and analysis capability
- 📜 Conversation history management
- 🎨 Beautiful, nature-inspired UI design
- 📱 Fully responsive (mobile and desktop)
- ⚡ Fast and modern user experience

---

## Purpose and Goals

### What Problem Does Aura Solve?

Aura addresses the challenge of making sustainable choices in everyday life. With overwhelming information about environmental issues, people often struggle to know:
- What products are truly eco-friendly
- How to properly recycle or compost items
- What sustainable alternatives exist
- How to reduce their environmental impact

### Aura's Approach

Aura takes a unique approach to sustainability education:
- **Non-judgmental**: Provides guidance without being preachy
- **Reinterpretation**: Can view any topic through a sustainability lens
- **Practical**: Focuses on actionable advice users can implement
- **Accessible**: Makes sustainability knowledge easy to understand
- **Multimodal**: Accepts both text and images for comprehensive analysis

### Target Audience
- Environmentally conscious consumers
- People new to sustainable living
- Anyone seeking eco-friendly alternatives
- Students learning about environmental topics
- Professionals needing quick sustainability insights

---

## Technology Stack

### Frontend Framework
- **React 18.3.1**: Modern UI library with hooks and concurrent features
- **TypeScript 5.5.3**: Type-safe JavaScript for better developer experience
- **Vite 5.4.1**: Lightning-fast build tool and development server

### UI and Styling
- **Tailwind CSS 3.4.11**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library built on Radix UI
- **Radix UI Primitives**: Accessible, unstyled UI components
- **Lucide React**: Beautiful, consistent icon library
- **class-variance-authority**: Elegant component variant management

### State Management
- **TanStack Query (React Query) 5.56.2**: Powerful data fetching and caching
- **React Hook Form 7.53.0**: Efficient form state management
- **Zod 3.23.8**: TypeScript-first schema validation

### Content Rendering
- **React Markdown 10.1.0**: Renders markdown in chat messages
- **remark-gfm 4.0.1**: GitHub Flavored Markdown support (tables, strikethrough, etc.)

### AI Integration
- **Google Gemini AI**: State-of-the-art large language model
- **Model**: gemini-2.0-flash-exp (latest flash model)
- Custom REST API integration with comprehensive configuration

### Development Tools
- **ESLint**: Code quality and consistency
- **SWC**: Fast TypeScript/JavaScript compiler
- **PostCSS**: CSS processing and optimization

---

## Architecture and Design

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│           User Interface                │
│  (React Components + Tailwind CSS)      │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│        Application Layer                │
│  (React State + TanStack Query)         │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│         API Integration                 │
│    (Google Gemini AI Service)           │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│       External AI Service               │
│      (Google Generative AI API)         │
└─────────────────────────────────────────┘
```

### Design Principles

1. **Component-Based Architecture**: Modular, reusable components
2. **Separation of Concerns**: Clear boundaries between UI, logic, and data
3. **Type Safety**: TypeScript throughout for reliability
4. **Responsive Design**: Mobile-first approach with progressive enhancement
5. **Accessibility**: Built on Radix UI's accessible primitives
6. **Performance**: Optimized rendering and lazy loading

---

## Core Components

### 1. ChatInterface (`src/components/ChatInterface.tsx`)

**Purpose**: The orchestrator component that manages the entire chat experience.

**Responsibilities**:
- Message state management
- API communication with Google Gemini AI
- Conversation history (up to 50 messages)
- Error handling and user feedback
- Loading states
- Auto-scrolling behavior

**Key Functions**:
- `handleSendMessage()`: Processes user input and triggers AI response
- `generateAIResponse()`: Communicates with AI API
- `clearChat()`: Resets conversation

**State**:
```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}
```

### 2. WelcomeScreen (`src/components/WelcomeScreen.tsx`)

**Purpose**: Engaging initial screen shown when no messages exist.

**Responsibilities**:
- Display hero image with branding
- Load and show example prompts from `/public/prompts.json`
- Provide quick-start options for users
- Randomize prompts for variety

**Features**:
- Animated fade-in
- Interactive prompt cards
- Random selection of 4 prompts from available set
- Click-to-populate functionality

### 3. ChatMessage (`src/components/ChatMessage.tsx`)

**Purpose**: Renders individual chat messages with rich formatting.

**Responsibilities**:
- Display message content with markdown support
- Show user/AI avatars and names
- Format timestamps
- Render uploaded images
- Responsive text sizing

**Markdown Features**:
- Headers, lists, code blocks
- Links and emphasis
- GitHub Flavored Markdown extensions
- Preserved formatting

### 4. ChatInput (`src/components/ChatInput.tsx`)

**Purpose**: Handles all user input including text and images.

**Responsibilities**:
- Text input with textarea
- Image upload and preview
- Input validation
- Submit handling
- Keyboard shortcuts

**Features**:
- Enter to send (Shift+Enter for new line)
- Image preview with remove option
- Disabled state during processing
- Auto-focus on mount
- File type validation (images only)

### 5. UI Components (`src/components/ui/`)

The project uses **40+ shadcn/ui components** including:
- `button.tsx`: Interactive buttons with variants
- `card.tsx`: Content containers
- `dialog.tsx`: Modal dialogs
- `toast.tsx`: Notification system
- `textarea.tsx`: Multi-line input
- `scroll-area.tsx`: Custom scrollbars
- And many more...

All components are:
- Fully accessible (ARIA attributes, keyboard navigation)
- Customizable with variants
- Type-safe with TypeScript
- Styled with Tailwind CSS

---

## Data Flow

### Message Lifecycle

```
1. User Types Message or Uploads Image
   ↓
2. ChatInput emits onSendMessage event
   ↓
3. ChatInterface receives message
   ↓
4. Validates API configuration
   ↓
5. Adds user message to state
   ↓
6. Component re-renders showing user message
   ↓
7. Builds conversation context:
   - System prompt
   - Previous messages (up to 50)
   - Current user message
   ↓
8. Sends POST request to Google Gemini API
   ↓
9. API processes with AI model
   ↓
10. Receives AI response
   ↓
11. Adds AI message to state
   ↓
12. Component re-renders showing AI message
   ↓
13. Auto-scrolls to bottom
```

### Conversation History Management

```typescript
// Messages are stored in state
const [messages, setMessages] = useState<Message[]>([]);

// History is limited to last 50 messages
const conversationHistory = messages.slice(-50);

// History format for API
const apiMessages = conversationHistory.map(msg => ({
  role: msg.role,
  parts: [{ text: msg.content }]
}));
```

### Error Handling Flow

```
API Call Initiated
   ↓
Try Block
   ↓
Error Occurs?
   ├─ No → Success path
   └─ Yes → Catch Block
            ↓
         Log error to console
            ↓
         Show toast notification to user
            ↓
         Keep user message visible
            ↓
         Clear loading state
```

---

## AI Integration

### Google Gemini AI Configuration

**API Details**:
```typescript
// Model: gemini-2.0-flash-exp
// Endpoint: https://generativelanguage.googleapis.com/v1beta/models/
```

**Generation Parameters**:
```typescript
{
  temperature: 0.7,        // Balance creativity and coherence
  topK: 40,                // Consider top 40 tokens
  topP: 0.95,              // Nucleus sampling threshold
  maxOutputTokens: 2048    // Response length limit
}
```

**Safety Settings**:
- Harassment: BLOCK_MEDIUM_AND_ABOVE
- Hate Speech: BLOCK_MEDIUM_AND_ABOVE
- Sexually Explicit: BLOCK_MEDIUM_AND_ABOVE
- Dangerous Content: BLOCK_MEDIUM_AND_ABOVE

### System Prompt

Aura uses a carefully crafted system prompt to define its personality and behavior:

```
You are Aura, a friendly and knowledgeable sustainability copilot...
- Provides practical, solution-oriented advice
- Non-judgmental and encouraging
- Focuses on recycling, composting, sustainable fashion, etc.
- Can reinterpret any topic through a sustainability lens
```

### API Request Structure

```typescript
{
  contents: [
    {
      role: 'user',
      parts: [{ text: 'System prompt' }]
    },
    ...conversationHistory,
    {
      role: 'user',
      parts: [
        { text: 'User message' },
        { inline_data: { mime_type, data } } // For images
      ]
    }
  ],
  generationConfig: { temperature, topK, topP, maxOutputTokens },
  safetySettings: [...]
}
```

### Image Support

Aura supports image uploads for visual sustainability analysis:

1. User selects image file
2. File converted to base64
3. Sent to API with mime type
4. AI analyzes image contents
5. Provides sustainability insights about the image

---

## Design System

### Color Palette

The design is inspired by nature and sustainability:

```css
/* Primary Colors */
--primary: 142.1 76.2% 36.3%        /* Forest Green #4A7C59 */
--primary-foreground: 355.7 100% 97.3%  /* Off-white */

/* Secondary Colors */
--secondary: 60 4.8% 95.9%          /* Sage Green #A3B18A */

/* Background */
--background: 0 0% 100%              /* Clean White */
--card: 60 30% 96%                   /* Cream #F9F9F7 */

/* Accent */
--accent: 43 52% 88%                 /* Warm Cream #F2E8CF */
```

### Typography

```css
/* Font Family */
font-family: system-ui, -apple-system, sans-serif

/* Responsive Sizing */
Desktop: text-base (16px)
Mobile: text-sm (14px)
```

### Visual Elements

1. **Background Pattern**: Subtle SVG circle pattern for depth
2. **Animations**:
   - Fade-in for messages
   - Pulse for accent elements
   - Smooth scrolling
3. **Spacing**: Consistent 8px grid system
4. **Border Radius**: Soft, rounded corners (0.5rem)
5. **Shadows**: Subtle elevation for cards and modals

### Responsive Breakpoints

```typescript
sm: '640px'   // Small tablets
md: '768px'   // Tablets
lg: '1024px'  // Laptops
xl: '1280px'  // Desktops
2xl: '1536px' // Large screens
```

### Dark Mode Support

The design system includes comprehensive dark mode variables for future implementation.

---

## Project Structure

```
aura/
├── public/                          # Static assets served as-is
│   ├── prompts.json                # Example sustainability prompts
│   ├── favicon.ico                 # Browser tab icon
│   ├── placeholder.svg             # Default image placeholder
│   └── robots.txt                  # SEO crawler instructions
│
├── src/                             # Source code
│   ├── assets/                      # Images and media files
│   │   └── sustainability-hero.jpg # Welcome screen hero image
│   │
│   ├── components/                  # React components
│   │   ├── ui/                     # shadcn/ui base components (40+)
│   │   │   ├── button.tsx          # Button variants
│   │   │   ├── card.tsx            # Content cards
│   │   │   ├── dialog.tsx          # Modal dialogs
│   │   │   ├── toast.tsx           # Notifications
│   │   │   ├── textarea.tsx        # Text input
│   │   │   ├── scroll-area.tsx     # Custom scrollbars
│   │   │   └── ...                 # Many more components
│   │   │
│   │   ├── ChatInterface.tsx       # Main chat orchestrator
│   │   ├── ChatMessage.tsx         # Individual message display
│   │   ├── ChatInput.tsx           # User input component
│   │   └── WelcomeScreen.tsx       # Initial welcome screen
│   │
│   ├── config/                      # Configuration files
│   │   └── api.ts                  # AI API configuration & system prompt
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-toast.ts            # Toast notification hook
│   │   └── use-mobile.tsx          # Mobile device detection
│   │
│   ├── lib/                         # Utility functions
│   │   └── utils.ts                # Helper functions (classNames, etc.)
│   │
│   ├── pages/                       # Route pages
│   │   ├── Index.tsx               # Home page (chat interface)
│   │   └── NotFound.tsx            # 404 error page
│   │
│   ├── App.tsx                      # Root application component
│   ├── App.css                      # Application-specific styles
│   ├── index.css                    # Global styles + CSS variables
│   ├── main.tsx                     # Application entry point
│   └── vite-env.d.ts               # Vite TypeScript definitions
│
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── vite.config.ts                   # Vite build configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript compiler options
├── components.json                  # shadcn/ui configuration
├── eslint.config.js                 # ESLint rules
└── postcss.config.js                # PostCSS configuration
```

### Key Files Explained

**`src/main.tsx`**: Entry point that mounts the React application
**`src/App.tsx`**: Sets up routing, providers, and global state
**`src/config/api.ts`**: Contains API key, endpoint, and Aura's personality
**`public/prompts.json`**: Example prompts shown on welcome screen
**`components.json`**: Configuration for shadcn/ui component generation

---

## Development Guide

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Runs on http://localhost:8080

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Setup

1. **API Key**: Update `src/config/api.ts` with your Google AI API key
2. **Port**: Default is 8080 (configured in `vite.config.ts`)
3. **Node Version**: Requires Node.js 16+ or Bun runtime

### Component Development

#### Adding a New UI Component

```bash
# Using shadcn/ui CLI (if installed)
npx shadcn-ui@latest add [component-name]
```

Components are added to `src/components/ui/` with full TypeScript support.

#### Creating a Custom Component

```typescript
// src/components/MyComponent.tsx
import { FC } from 'react';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className="p-4 bg-card rounded-lg">
      <h2 className="text-xl font-semibold">{title}</h2>
      <button onClick={onAction} className="mt-2">
        Action
      </button>
    </div>
  );
};
```

### Best Practices

1. **Type Safety**: Always define TypeScript interfaces for props
2. **Accessibility**: Use semantic HTML and ARIA attributes
3. **Performance**: Use React.memo for expensive components
4. **State Management**: Keep state as local as possible
5. **Error Handling**: Always wrap API calls in try-catch
6. **Responsive Design**: Test on multiple screen sizes

### Code Style

- **Naming**: PascalCase for components, camelCase for functions
- **Formatting**: Handled by ESLint
- **Imports**: Absolute paths using `@/` alias
- **CSS**: Tailwind utility classes, avoid custom CSS when possible

### Testing Considerations

While tests are not currently implemented, consider adding:
- Unit tests for utility functions
- Component tests with React Testing Library
- Integration tests for chat flow
- E2E tests with Playwright

### Deployment

Build outputs to `dist/` directory:
```bash
npm run build
```

Deploy to:
- Vercel (recommended for Vite projects)
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

---

## Key Insights and Implementation Details

### Why These Technologies?

**React + TypeScript**: Industry standard, excellent DX, strong typing
**Vite**: Fastest build tool, HMR, modern ES modules
**Tailwind CSS**: Rapid development, consistent styling, small bundle
**shadcn/ui**: Copy-paste components, full customization, no bloat
**TanStack Query**: Best-in-class data fetching, built-in caching
**Google Gemini**: Powerful AI, multimodal support, good pricing

### Performance Optimizations

1. **Message Limiting**: Only keeps last 50 messages to prevent memory issues
2. **Auto-scroll**: Smooth scrolling to latest message
3. **Lazy Loading**: Vite's code splitting for optimal bundles
4. **Image Optimization**: Client-side resizing before upload
5. **Debouncing**: Prevents rapid API calls

### Security Considerations

1. **API Key**: Should be moved to environment variables in production
2. **Input Validation**: File type checking for uploads
3. **Content Safety**: AI safety settings enabled
4. **XSS Prevention**: React's automatic escaping
5. **HTTPS**: Enforced for API calls

### Future Enhancements

Potential improvements:
- User authentication and saved conversations
- Export chat history
- Voice input/output
- Multi-language support
- Carbon footprint calculator
- Community features (share tips)
- Mobile app version
- Integration with sustainability databases

---

## Conclusion

Aura is a modern, well-architected web application that makes sustainability knowledge accessible through conversational AI. Built with best practices and cutting-edge technologies, it demonstrates:

- Clean component architecture
- Type-safe development
- Responsive, accessible design
- Effective AI integration
- Scalable codebase structure

The project serves as both a practical sustainability tool and a showcase of modern React development patterns.

---

**Last Updated**: 2025-11-11
**Version**: 1.0.0
**Maintainer**: Aura Development Team
