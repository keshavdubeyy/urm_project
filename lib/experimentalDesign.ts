import { ExperimentalCondition } from "@/types/survey";

/**
 * Generates experimental condition with fixed order and brick object
 * 
 * Design:
 * - Task 1: Pre-AI (No-AI)
 * - Task 2: Post-AI (AI)
 * - Object: Always Brick for both tasks
 */
export function generateExperimentalCondition(): ExperimentalCondition {
  // Fixed object: Always Brick for both tasks
  const assignedObject = "Brick";
  
  // Fixed order: Task 1 = Pre-AI (No-AI), Task 2 = Post-AI (AI)
  // Same brick object used in both tasks
  return {
    group: "Fixed Order",
    objectAssignment: assignedObject,
    task1: {
      condition: "No-AI",
      object: assignedObject,
      objectLabel: "Object A"
    },
    task2: {
      condition: "AI", 
      object: assignedObject,
      objectLabel: "Object B"
    }
  };
}

/**
 * Get task instructions based on object
 */
export function getTaskInstruction(object: "Paperclip" | "Brick", objectLabel: "Object A" | "Object B"): string {
  const objectDescriptions = {
    Paperclip: "a paperclip",
    Brick: "a brick"
  };
  
  return `Think of creative and unusual uses for ${objectDescriptions[object]} (${objectLabel}). Try to come up with as many different, original ideas as possible. Be creative and think outside the box!`;
}

/**
 * Get the display name for a condition
 */
export function getConditionDisplayName(condition: "No-AI" | "AI"): string {
  return condition === "No-AI" ? "Pre-AI" : "Post-AI";
}

/**
 * Get navigation paths based on experimental condition
 * Since order is fixed (Task 1 = No-AI, Task 2 = AI), navigation is simplified
 */
export function getTaskNavigation(condition: ExperimentalCondition) {
  return {
    firstTask: "/task-no-ai",
    secondTask: "/task-ai",
    isFirstTaskNoAI: true,
    isSecondTaskNoAI: false
  };
}

/**
 * Get task details for current task (1 or 2)
 */
export function getTaskDetails(condition: ExperimentalCondition, taskNumber: 1 | 2) {
  const task = taskNumber === 1 ? condition.task1 : condition.task2;
  
  return {
    condition: task.condition,
    object: task.object,
    objectLabel: task.objectLabel,
    instruction: getTaskInstruction(task.object, task.objectLabel),
    conditionDisplay: getConditionDisplayName(task.condition)
  };
}

/**
 * Check if we're currently on the correct task path for the condition
 * Since order is fixed (Task 1 = No-AI, Task 2 = AI), validation is simplified
 */
export function validateTaskPath(condition: ExperimentalCondition, currentPath: string, taskNumber: 1 | 2): boolean {
  const expectedPath = taskNumber === 1 ? "/task-no-ai" : "/task-ai";
  return currentPath.startsWith(expectedPath);
}

/**
 * Debug function to show condition details
 */
export function logExperimentalCondition(condition: ExperimentalCondition) {
  console.log("🧪 Experimental Condition Assigned:");
  console.log(`   Group: ${condition.group}`);
  console.log(`   Object: ${condition.objectAssignment}`);
  console.log(`   Task 1: ${condition.task1.condition} on ${condition.task1.object}`);
  console.log(`   Task 2: ${condition.task2.condition} on ${condition.task2.object}`);
}