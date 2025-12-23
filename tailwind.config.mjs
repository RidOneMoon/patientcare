/** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#2563eb",    
//         secondary: "#f8fafc",  // Light Slate
//         accent: "#0f172a",     // Deep Navy
//       },
//       borderRadius: {
//         '3xl': '1.5rem',
//         '4xl': '2rem',
//       }
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can define a custom off-white color here
        brandOffWhite: "#f8fafc",
      },
      // Ensure there are no background-image gradients here
      backgroundImage: {}, 
    },
  },
  plugins: [],
};
