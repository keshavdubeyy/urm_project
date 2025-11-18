import { ExperimentalCondition } from "@/types/survey";

/**
 * Generates a randomized experimental condition for counterbalanced design
 * 
 * Design:
 * - Order A: Task 1 = No-AI, Task 2 = AI
 * - Order B: Task 1 = AI, Task 2 = No-AI
 * - Object Assignment: Half get Paperclip=ObjectA, half get Brick=ObjectA
 * 
 * This creates 4 possible conditions:
 * 1. Order A + Paperclip=ObjectA: No-AI Paperclip → AI Brick
 * 2. Order A + Brick=ObjectA: No-AI Brick → AI Paperclip  
 * 3. Order B + Paperclip=ObjectA: AI Paperclip → No-AI Brick
 * 4. Order B + Brick=ObjectA: AI Brick → No-AI Paperclip
 */
export function generateExperimentalCondition(): ExperimentalCondition {
  // Random assignment to Order A or Order B
  const group = Math.random() < 0.5 ? "Order A" : "Order B";
  
  // Random assignment to object crossing
  const objectAssignment = Math.random() < 0.5 ? "Paperclip=ObjectA" : "Brick=ObjectA";
  
  // Determine objects based on assignment
  const objectA = objectAssignment === "Paperclip=ObjectA" ? "Paperclip" : "Brick";
  const objectB = objectAssignment === "Paperclip=ObjectA" ? "Brick" : "Paperclip";
  
  // Determine task conditions based on group
  if (group === "Order A") {
    // Order A: No-AI first, then AI
    return {
      group,
      objectAssignment,
      task1: {
        condition: "No-AI",
        object: objectA,
        objectLabel: "Object A"
      },
      task2: {
        condition: "AI", 
        object: objectB,
        objectLabel: "Object B"
      }
    };
  } else {
    // Order B: AI first, then No-AI
    return {
      group,
      objectAssignment,
      task1: {
        condition: "AI",
        object: objectA, 
        objectLabel: "Object A"
      },
      task2: {
        condition: "No-AI",
        object: objectB,
        objectLabel: "Object B"
      }
    };
  }
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
  return condition === "No-AI" ? "Without AI Assistance" : "With AI Assistance";
}

/**
 * Get navigation paths based on experimental condition
 */
export function getTaskNavigation(condition: ExperimentalCondition) {
  const firstTaskPath = condition.task1.condition === "No-AI" ? "/task-no-ai" : "/task-ai";
  const secondTaskPath = condition.task2.condition === "No-AI" ? "/task-no-ai" : "/task-ai";
  
  return {
    firstTask: firstTaskPath,
    secondTask: secondTaskPath,
    isFirstTaskNoAI: condition.task1.condition === "No-AI",
    isSecondTaskNoAI: condition.task2.condition === "No-AI"
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
 */
export function validateTaskPath(condition: ExperimentalCondition, currentPath: string, taskNumber: 1 | 2): boolean {
  const task = taskNumber === 1 ? condition.task1 : condition.task2;
  const expectedPath = task.condition === "No-AI" ? "/task-no-ai" : "/task-ai";
  return currentPath.startsWith(expectedPath);
}

/**
 * Debug function to show condition details
 */
export function logExperimentalCondition(condition: ExperimentalCondition) {
  console.log("🧪 Experimental Condition Assigned:");
  console.log(`   Group: ${condition.group}`);
  console.log(`   Object Assignment: ${condition.objectAssignment}`);
  console.log(`   Task 1: ${condition.task1.condition} on ${condition.task1.object} (${condition.task1.objectLabel})`);
  console.log(`   Task 2: ${condition.task2.condition} on ${condition.task2.object} (${condition.task2.objectLabel})`);
}