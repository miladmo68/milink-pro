const stageNames={draft:"project brief",submitted:"brief review",reviewing:"requirements review",proposal_sent:"proposal review",in_progress:"development",client_review:"client review",completed:"launch handoff"};

const cleanText=value=>String(value||"").replace(/\s+/g," ").trim();
const compactUpdate=value=>{const text=cleanText(value);if(!text)return "";return text.length>148?`${text.slice(0,145).trimEnd()}…`:text;};
const isPaymentDue=brief=>{
  const status=String(brief?.payment_status||"").toLowerCase();
  const hasProposal=Number(brief?.proposal_amount_cents)>0;
  return hasProposal&&!["paid","e_transfer_submitted"].includes(status);
};

/**
 * Produces a client-safe, data-backed project narrative. Keep this pure function
 * as the seam for a future server-side LLM implementation.
 */
export function composeProjectSummary({brief,fileRequests=[],approvals=[]}={}){
  const status=brief?.status||"draft";
  const projectName=cleanText(brief?.business_name)||"your website project";
  const latestUpdate=Array.isArray(brief?.timeline_updates)?[...brief.timeline_updates].filter(item=>cleanText(item?.message)).sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0))[0]:null;
  const checklist=Array.isArray(brief?.onboarding_checklist)?brief.onboarding_checklist:[];
  const readyCount=checklist.filter(item=>item?.status==="ready").length;
  const checklistTotal=checklist.length||4;
  const pendingFiles=fileRequests.filter(item=>item?.status==="pending").length;
  const pendingApprovals=approvals.filter(item=>item?.status==="pending").length;
  const targetDate=brief?.target_launch_date?new Date(brief.target_launch_date):null;
  const targetIsValid=targetDate&&!Number.isNaN(targetDate.getTime());
  const updateLead=latestUpdate?` Latest ${cleanText(latestUpdate.category||"project").toLowerCase()} update: “${compactUpdate(latestUpdate.message)}”`:"";
  let summary="";

  if(status==="draft")summary=`${projectName} is still taking shape. Complete and submit the brief when you are ready, and the MiLink team can begin planning the right next steps.`;
  else if(status==="submitted")summary=`We have received the brief for ${projectName}. The MiLink team is reviewing your requirements and preparing the next project step.${updateLead}`;
  else if(status==="reviewing")summary=`${projectName} is under review. The team is turning your requirements into a clear scope and proposal.${updateLead}`;
  else if(status==="proposal_sent")summary=`The proposal for ${projectName} is ready for your review. Once the scope is confirmed, the team can schedule the next phase.${updateLead}`;
  else if(status==="in_progress")summary=`${projectName} is actively moving through development. The MiLink team is building and refining the work in your shared workspace.${updateLead}`;
  else if(status==="client_review")summary=`${projectName} is ready for your review. Please look through the latest deliverables so the team can confidently prepare the launch.${updateLead}`;
  else if(status==="completed")summary=`${projectName} is complete. Your handoff resources and ongoing support options are available whenever you need them.${updateLead}`;
  else summary=`${projectName} is currently in ${stageNames[status]||"its next project stage"}.${updateLead}`;

  let action="";
  if(pendingFiles)action=`What’s needed from you: ${pendingFiles===1?"one requested file or note is waiting":"requested files or notes are waiting"} in your workspace.`;
  else if(pendingApprovals)action=`What’s needed from you: ${pendingApprovals===1?"one deliverable is ready for your review":"deliverables are ready for your review"}.`;
  else if(isPaymentDue(brief))action="What’s needed from you: review your proposal and choose a payment method when you are ready.";
  else if(status==="draft")action="What’s needed from you: finish the essentials in your project brief before submitting it.";
  else if(checklistTotal&&readyCount<checklistTotal)action=`You have ${readyCount} of ${checklistTotal} onboarding essentials ready. You can update them anytime as materials become available.`;
  else if(targetIsValid&&!["completed","draft"].includes(status))action=`Your target launch window is ${targetDate.toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"})}. Nothing is needed from you right now.`;
  else action="Nothing is needed from you at the moment. The MiLink team will post the next update here.";

  return {summary,action,stage:stageNames[status]||"project update",status,hasAction:Boolean(pendingFiles||pendingApprovals||isPaymentDue(brief)||status==="draft"),latestUpdate};
}
