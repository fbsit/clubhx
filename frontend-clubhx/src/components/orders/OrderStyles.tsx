
import React from 'react';
import { useEffect } from 'react';

export default function OrderStyles() {
  useEffect(() => {
    const styleId = 'order-custom-styles';
    
    // Only add the style if it doesn't already exist
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Order status badges */
        .status-badge {
          font-size: 0.75rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        /* Status colors with animation */
        .status-completed {
          background-color: rgba(34, 197, 94, 0.15);
          color: rgba(34, 197, 94, 1);
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        
        .status-shipped {
          background-color: rgba(79, 70, 229, 0.15);
          color: rgba(79, 70, 229, 1);
          border: 1px solid rgba(79, 70, 229, 0.2);
        }
        
        .status-canceled, .status-rejected {
          background-color: rgba(239, 68, 68, 0.15);
          color: rgba(239, 68, 68, 1);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .status-requested {
          background-color: rgba(245, 158, 11, 0.15);
          color: rgba(245, 158, 11, 1);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        
        .status-accepted {
          background-color: rgba(16, 185, 129, 0.15);
          color: rgba(16, 185, 129, 1);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .status-invoiced {
          background-color: rgba(139, 92, 246, 0.15);
          color: rgba(139, 92, 246, 1);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        /* Add pulse animation to active status badges */
        .status-requested, .status-shipped {
          animation: pulse-badge 3s infinite;
        }
        
        @keyframes pulse-badge {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        /* Card hover effects */
        .order-card {
          transition: all 0.2s ease-in-out;
        }
        
        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
        }
        
        /* Hide scrollbar for cleaner UI but keep functionality */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
        
        /* Smooth scroll behavior for all elements */
        * {
          scroll-behavior: smooth;
        }
        
        /* Progress indicator animation */
        @keyframes progress-pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        .progress-indicator {
          animation: progress-pulse 2s infinite;
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      // Clean up style when component unmounts
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
