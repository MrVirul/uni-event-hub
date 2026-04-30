# UI Design: Uni Event Hub - Instagram Feed Style

## Concept
The UI is inspired by modern social media feeds (specifically Instagram) to make event discovery intuitive, visual, and engaging. The design focuses on high-quality imagery, clear event details, and seamless interaction.

---

## 🎨 Color System

### ☀️ Light Mode: "The Clean Campus"
Prioritizes readability and airiness. Uses off-whites to reduce glare.

| Element | HEX Code | Usage |
| :--- | :--- | :--- |
| **Background** | `#F8FAFC` | Main app background (Soft off-white) |
| **Surface** | `#FFFFFF` | Feed cards, headers, and navigation bars |
| **Primary** | `#4F46E5` | Buttons, active icons, and links (Indigo) |
| **Text Primary** | `#0F172A` | Headlines and main content (Deep Navy) |
| **Text Secondary** | `#64748B` | Dates, "History," and minor details |
| **Success** | `#10B981` | "Register Successful" alerts |

### 🌙 Dark Mode: "Late-Night Study"
Uses deep charcoals for a premium feel and high-contrast image pop.

| Element | HEX Code | Usage |
| :--- | :--- | :--- |
| **Background** | `#0F172A` | Main app background (Deep Navy/Charcoal) |
| **Surface** | `#1E293B` | Feed cards and bottom navigation bar |
| **Primary** | `#818CF8` | Buttons and highlights (Lighter Indigo) |
| **Text Primary** | `#F8FAFC` | Headlines (Soft White) |
| **Text Secondary** | `#94A3B8` | Muted descriptions and history text |
| **Success** | `#34D399` | Confirmation messages |

---

## 📱 Component Architecture (Instagram Style)

### 1. Header (Sticky)
- **Left:** App Logo (Uni Event Hub) in Primary color.
- **Right:** Notification bell and Profile shortcut.
- **Style:** Glassmorphism effect (blur) over the Surface color.

### 2. Event Feed Card
- **User/Org Info:** Small avatar + Organization name + Location (e.g., "Main Auditorium").
- **Visual:** 4:5 or 1:1 Aspect Ratio image/video of the event.
- **Action Bar:** 
  - Left: "Interested" (Heart), "Comment" (Speech Bubble), "Share".
  - Right: "Bookmark" (Save).
- **Details:**
  - Bold "Interested by [X] others".
  - **Event Title** + Description snippet.
  - "View all [X] comments".
  - Timestamp (e.g., "2 HOURS AGO").

### 3. Navigation Bar (Bottom)
- 5 Tabs: **Home, Search, Create Event (+ icon), Calendar, Profile**.
- **Active State:** Primary color with a subtle dot indicator below the icon.

### 4. Event Create Button (Floating)
- A prominent floating action button (FAB) in the center of the bottom bar using the **Primary** color.

---

## 🛠 Implementation Details
- **Typography:** Using *Inter* or *Outfit* for a modern, tech-forward look.
- **Borders:** `0.5px` (Hairline) using the `border` variable.
- **Shadows:** Subtle elevation on cards in Light Mode; Inner glow or border only in Dark Mode.
- **Transitions:** Smooth 200ms fades between light and dark modes.
