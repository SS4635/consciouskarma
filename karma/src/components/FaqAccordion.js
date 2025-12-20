// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// export default function FaqAccordion() {
//   const [openFaq, setOpenFaq] = useState(null);

//   const faqs = [
//     {
//       id: 1,
//       question: "What is mobile numerology?",
//       answer: "Mobile numerology is the study of how numbers in your phone number can influence your life, career, relationships, and overall well-being. Each number carries specific vibrations and energies that can impact various aspects of your life."
//     },
//     {
//       id: 2,
//       question: "How does a phone number affect my life?",
//       answer: "Your phone number is used daily for communication and connections. The numerical vibrations from your phone number can influence your communication style, opportunities, relationships, and even your luck in business and personal matters."
//     },
//     {
//       id: 3,
//       question: "Can I choose a lucky mobile number?",
//       answer: "Yes! Through numerological analysis, we can help you select a phone number that aligns with your birth date, name numerology, and life goals. A compatible number can enhance positive energies and opportunities in your life."
//     },
//     {
//       id: 4,
//       question: "What if I already have a phone number?",
//       answer: "We can analyze your current phone number to understand its impact on your life. Based on the analysis, we can suggest remedies, additional numbers for balance, or recommend when it might be beneficial to consider changing your number."
//     },
//     {
//       id: 5,
//       question: "How long does a consultation take?",
//       answer: "A standard consultation typically takes 45-60 minutes. This includes analyzing your current number, understanding your life goals, and providing personalized recommendations. Detailed reports are provided within 24-48 hours after consultation."
//     },
//     {
//       id: 6,
//       question: "Do you provide compatibility analysis?",
//       answer: "Yes! We offer compatibility analysis between your phone number and your partner's, business partner's, or family member's numbers. This helps in understanding communication dynamics and harmonizing relationships."
//     },
//     {
//       id: 7,
//       question: "Is online consultation effective?",
//       answer: "Absolutely! Online consultations are just as effective as in-person sessions. We use video calls, detailed questionnaires, and provide comprehensive reports. The convenience of online consultation allows you to connect from anywhere in the world."
//     },
//     {
//       id: 8,
//       question: "What payment methods do you accept?",
//       answer: "We accept various payment methods including credit/debit cards, UPI, net banking, and digital wallets. All transactions are secure and encrypted. Payment links are shared via email after booking confirmation."
//     }
//   ];

//   const toggleFaq = (id) => {
//     setOpenFaq(openFaq === id ? null : id);
//   };

//   return (
//     <div className="min-vh-100 bg-black text-white d-flex align-items-center py-5">
//       <style>{`
//         .faq-container {
//           max-width: 800px;
//           margin: 0 auto;
//           padding: 0 15px;
//         }
        
//         .faq-title {
//           font-size: 2.5rem;
//           font-weight: 300;
//           margin-bottom: 3rem;
//           text-align: center;
//         }
        
//         .faq-item {
//           margin-bottom: 1rem;
//           border: 2px solid #666;
//           border-radius: 12px;
//           overflow: hidden;
//           transition: all 0.3s ease;
//         }
        
//         .faq-item.active {
//           border-color: #ff6b35;
//         }
        
//         .faq-question {
//           background: transparent;
//           border: none;
//           width: 100%;
//           padding: 1.25rem 1.5rem;
//           color: white;
//           font-size: 1.1rem;
//           font-weight: 400;
//           text-align: center;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
        
//         .faq-question:hover {
//           background: rgba(255, 107, 53, 0.1);
//         }
        
//         .faq-answer {
//           padding: 0 1.5rem;
//           max-height: 0;
//           overflow: hidden;
//           transition: all 0.3s ease;
//           font-size: 1rem;
//           line-height: 1.6;
//           color: #e0e0e0;
//         }
        
//         .faq-answer.open {
//           max-height: 500px;
//           padding: 1rem 1.5rem 1.5rem 1.5rem;
//           border-top: 1px solid #444;
//         }
        
//         /* Responsive Design */
//         @media (max-width: 768px) {
//           .faq-title {
//             font-size: 2rem;
//             margin-bottom: 2rem;
//           }
          
//           .faq-question {
//             font-size: 1rem;
//             padding: 1rem 1rem;
//           }
          
//           .faq-answer {
//             font-size: 0.95rem;
//             padding: 0 1rem;
//           }
          
//           .faq-answer.open {
//             padding: 1rem 1rem 1.25rem 1rem;
//           }
//         }
        
//         @media (max-width: 576px) {
//           .faq-title {
//             font-size: 1.75rem;
//             margin-bottom: 1.5rem;
//           }
          
//           .faq-question {
//             font-size: 0.95rem;
//             padding: 0.9rem 0.9rem;
//           }
          
//           .faq-answer {
//             font-size: 0.9rem;
//           }
          
//           .faq-item {
//             margin-bottom: 0.75rem;
//           }
//         }
//       `}</style>

//       <div className="container">
//         <div className="faq-container">
//           <h1 className="faq-title">Faqs</h1>
          
//           {faqs.map((faq) => (
//             <div 
//               key={faq.id} 
//               className={`faq-item ${openFaq === faq.id ? 'active' : ''}`}
//             >
//               <button 
//                 className="faq-question"
//                 onClick={() => toggleFaq(faq.id)}
//               >
//                 FAQ {faq.id}
//               </button>
//               <div className={`faq-answer ${openFaq === faq.id ? 'open' : ''}`}>
//                 <strong>Q: {faq.question}</strong>
//                 <p className="mt-2 mb-0">{faq.answer}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Faq.css'; // Import the CSS file
export default function FaqAccordion() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Same FAQs as Personalized Report page
  const faqs = [
    {
      id: 1,
      question: "What happens after I book the consultation?",
      answer:
        " Once your booking is confirmed, you’ll receive a discovery form within 3 days to share your details and context.After submission, a 25-minute video consultation is scheduled — you’ll receive a link with available time slots to choose from.",
    },
    {
      id: 2,
      question: "Do you provide the new mobile number?",
      answer:
        "No. We don’t sell or supply numbers.You’ll request available options from your network provider, and we’ll analyse them to help you choose the most aligned one.(You can also read our guide — “How to Read a Mobile Number” [link])",
    },
    {
      id: 3,
      question: "Can I keep my existing number and still benefit from consultation?",
      answer:
        "Yes. If your current number is energetically aligned, you may not need to change it.The consultation can help you understand whether it supports your goals or if a better alternative is needed.Once a new number is chosen, it’s best to close the old one within 2–3 weeks.This allows the new number’s energy to stabilise and reduces interference from overlapping vibrations.",
    },
    {
      id: 4,
      question: " What if I don’t find a suitable number right away?",
      answer:
        "That’s completely fine. Finding the right number can take time — we’re available over WhatsApp chat for continued guidance until it’s finalised.",
    },
    {
      id: 5,
      question: " Why are there different consultation prices?",
      answer:
        "Pricing depends on the depth of compatibility analysis involved.Some consultations review only one number, while others consider multiple connections — such as a spouse, business partner, or family — to ensure harmony across all energies.",
    },
    {
      id: 6,
      question: "What is the usual availability for video consultations?",
      answer:
        "Consultations are generally scheduled within 5-7 working days after form submission.You’ll receive confirmation via email for your preferred time slot.",
    },
    {
      id: 7,
      question: "What time slots are usually available for the video call?",
      answer:
        "Consultations are typically available between 09:00 AM – 1:00 PM IST. ",
    },
    {
      id: 8,
      question: "In which language will the consultation be conducted?",
      answer:
        "Consultations are available in English and Hindi.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="ck-faq-section text-center">
      <div className="ck-faq-title">Faqs</div>
      <div className="ck-faq-list " >
        {faqs.map((faq, index) => {
          const questionText = faq.question.replace(/^[0-9]+\s*[-–]\s*/, "");
          const isOpen = openFaqIndex === index;
          return (
            <div
              key={index}
              className={
                "ck-faq-item" + (isOpen ? " ck-faq-item-active" : "")
              }
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-row">
                <button
                  type="button"
                  className={"faq-toggle" + (isOpen ? " open" : "")}
                  aria-expanded={isOpen}
                >
                  <span className="faq-arrow">›</span>
                </button>

                <div className="faq-question">{questionText}</div>
              </div>

              {isOpen && (
                <div className="faq-answer" style={{display: 'block', width: '100%'}}>{faq.answer}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="ck-faq-footer py-1 pb-2">
        For any questions, write to us at hello@consciouskarma.co
      </div>

      
    </section>
  );
}