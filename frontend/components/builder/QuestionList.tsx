"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { QuestionCard } from "@/components/builder/QuestionCard";
import type { Question } from "@/lib/types";

interface QuestionListProps {
  questions: Question[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onReorder: (orderedIds: number[]) => void;
}

export function QuestionList({ questions, selectedId, onSelect, onDelete, onReorder }: QuestionListProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const activeQuestion = questions.find((q) => q.id === activeId) ?? null;
  const activeIndex = activeQuestion ? questions.indexOf(activeQuestion) : -1;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...questions];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    onReorder(reordered.map((q) => q.id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            isSelected={question.id === selectedId}
            onSelect={() => onSelect(question.id)}
            onDelete={() => onDelete(question.id)}
          />
        ))}
      </SortableContext>

      <DragOverlay>
        {activeQuestion && (
          <div className="rotate-2 rounded-[var(--radius-md)] bg-[var(--color-surface)] shadow-[var(--shadow-popover)] ring-1 ring-[var(--color-border)]">
            <QuestionCard
              question={activeQuestion}
              index={activeIndex}
              isSelected={activeQuestion.id === selectedId}
              onSelect={() => {}}
              onDelete={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
