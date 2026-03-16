import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { collection, addDoc, serverTimestamp, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/firebase';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const addLeadFunctionDeclaration: FunctionDeclaration = {
  name: "addLead",
  description: "Add a new lead to the database.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "The name of the lead." },
      email: { type: Type.STRING, description: "The email address of the lead." },
      company: { type: Type.STRING, description: "The company the lead works for." },
      status: { type: Type.STRING, description: "The status of the lead (e.g., 'New', 'Contacted', 'Qualified')." },
      value: { type: Type.NUMBER, description: "The estimated value of the lead." },
      source: { type: Type.STRING, description: "The source of the lead (e.g., 'Inbound', 'Outbound', 'Referral')." },
    },
    required: ["name", "email", "company", "status", "value", "source"],
  },
};

const updateLeadStatusFunctionDeclaration: FunctionDeclaration = {
  name: "updateLeadStatus",
  description: "Update the status of an existing lead by their email.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      email: { type: Type.STRING, description: "The email address of the lead to update." },
      newStatus: { type: Type.STRING, description: "The new status of the lead (e.g., 'New', 'Contacted', 'Qualified', 'Negotiation', 'Closed Won', 'Closed Lost')." },
    },
    required: ["email", "newStatus"],
  },
};

const getLeadsFunctionDeclaration: FunctionDeclaration = {
  name: "getLeads",
  description: "Retrieve a list of leads from the database. Optionally filter by status.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      status: { type: Type.STRING, description: "Optional status to filter leads by." },
    },
  },
};

export async function generateAgentResponse(agentType: string, message: string, context: any[] = [], userId?: string) {
  let systemInstruction = "You are a helpful AI assistant.";
  let tools: any[] = [];
  
  if (agentType === "Orchestrator") {
    systemInstruction = "You are the Orchestrator AI. You manage the overall sales pipeline, assign tasks, and provide high-level strategic advice. You speak in a professional, commanding, yet supportive tone. Use the ethereal, liquid metal theme in your responses if applicable. You can add new leads, update lead statuses, and retrieve leads from the database.";
    tools = [{ functionDeclarations: [addLeadFunctionDeclaration, updateLeadStatusFunctionDeclaration, getLeadsFunctionDeclaration] }];
  } else if (agentType === "Market Intel") {
    systemInstruction = "You are the Market Intel AI. You analyze market trends, competitor movements, and provide actionable intelligence. You are analytical, precise, and data-driven. Use the googleSearch tool to find the latest market data.";
    tools = [{ googleSearch: {} }];
  } else if (agentType === "Prospecting") {
    systemInstruction = "You are the Prospecting AI. You help identify new leads, draft outreach emails, and optimize conversion rates. You are energetic, persuasive, and action-oriented. Use the googleSearch tool to research potential leads and companies. You can also add new leads, update lead statuses, and retrieve leads from the database.";
    tools = [{ googleSearch: {} }, { functionDeclarations: [addLeadFunctionDeclaration, updateLeadStatusFunctionDeclaration, getLeadsFunctionDeclaration] }];
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: tools.length > 0 ? tools : undefined,
      }
    });

    // Replay context if any
    for (const msg of context) {
      if (msg.role === 'user') {
        await chat.sendMessage({ message: msg.content });
      }
    }

    let response = await chat.sendMessage({ message });
    
    // Handle function calls
    if (response.functionCalls && response.functionCalls.length > 0) {
      for (const call of response.functionCalls) {
        if (call.name === "addLead") {
          const args = call.args as any;
          try {
            await addDoc(collection(db, "leads"), {
              name: args.name,
              email: args.email,
              company: args.company,
              status: args.status,
              value: args.value,
              source: args.source,
              lastAction: "Added by AI Agent",
              probability: Math.floor(Math.random() * 50) + 10, // Random probability for now
              ownerId: userId || "system",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            
            // Send the result back to the model
            response = await chat.sendMessage({
              message: `Function addLead executed successfully. Lead ${args.name} added.`,
            });
          } catch (e) {
            console.error("Error adding lead:", e);
            response = await chat.sendMessage({
              message: `Function addLead failed with error: ${e}`,
            });
          }
        } else if (call.name === "updateLeadStatus") {
          const args = call.args as any;
          try {
            let q = query(collection(db, "leads"), where("email", "==", args.email));
            if (userId) {
              q = query(q, where("ownerId", "==", userId));
            }
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
              response = await chat.sendMessage({
                message: `Function updateLeadStatus failed: No lead found with email ${args.email}.`,
              });
            } else {
              const leadDoc = querySnapshot.docs[0];
              await updateDoc(doc(db, "leads", leadDoc.id), {
                status: args.newStatus,
                lastAction: `Status updated to ${args.newStatus} by AI Agent`,
                updatedAt: serverTimestamp(),
              });
              
              response = await chat.sendMessage({
                message: `Function updateLeadStatus executed successfully. Lead ${args.email} status updated to ${args.newStatus}.`,
              });
            }
          } catch (e) {
            console.error("Error updating lead status:", e);
            response = await chat.sendMessage({
              message: `Function updateLeadStatus failed with error: ${e}`,
            });
          }
        } else if (call.name === "getLeads") {
          const args = call.args as any;
          try {
            let q = collection(db, "leads") as any;
            if (userId) {
              q = query(q, where("ownerId", "==", userId));
            }
            if (args.status) {
              q = query(q, where("status", "==", args.status));
            }
            const querySnapshot = await getDocs(q);
            const leads = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
            
            response = await chat.sendMessage({
              message: `Function getLeads executed successfully. Found ${leads.length} leads. Data: ${JSON.stringify(leads)}`,
            });
          } catch (e) {
            console.error("Error getting leads:", e);
            response = await chat.sendMessage({
              message: `Function getLeads failed with error: ${e}`,
            });
          }
        }
      }
    }

    return response.text;
  } catch (error) {
    console.error("Error generating agent response:", error);
    return "I encountered an error processing your request. Please try again.";
  }
}
