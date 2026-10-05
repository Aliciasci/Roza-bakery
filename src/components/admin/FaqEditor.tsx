"use client";

import { saveFaq } from "@/app/admin/actions";
import type { FaqItem } from "@/lib/types";
import { AddButton, Card, PageTitle, RowActions, SaveBar, TextInput, Toggle, makeId, move, useEditor } from "./ui";

export function FaqEditor({ initial }: { initial: FaqItem[] }) {
  const editor = useEditor(initial, saveFaq);
  const items = editor.value;
  const setItem = (i: number, patch: Partial<FaqItem>) => editor.setValue(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  return (
    <>
      <PageTitle
        title="FAQ"
        intro="Questions fréquentes. Les passages entre crochets [ ] sont surlignés comme « à compléter » sur le site."
      />
      <div className="space-y-4">
        {items.map((item, i) => (
          <Card key={item.id}>
            <div className="flex items-start gap-3">
              <div className="grid flex-1 gap-4">
                <TextInput label={`Question ${i + 1}`} value={item.question} onChange={(v) => setItem(i, { question: v })} />
                <TextInput label="Réponse" value={item.answer} multiline onChange={(v) => setItem(i, { answer: v })} />
                <Toggle
                  label="Réponse à compléter"
                  description="Exclue des données SEO tant qu'elle n'est pas finalisée"
                  checked={Boolean(item.placeholder)}
                  onChange={(v) => setItem(i, { placeholder: v || undefined })}
                />
              </div>
              <RowActions
                index={i}
                length={items.length}
                label={item.question}
                onMove={(d) => editor.setValue(move(items, i, d))}
                onDelete={() => editor.setValue(items.filter((_, j) => j !== i))}
              />
            </div>
          </Card>
        ))}
        <AddButton onClick={() => editor.setValue([...items, { id: makeId("question"), question: "", answer: "" }])}>Ajouter une question</AddButton>
      </div>
      <SaveBar dirty={editor.dirty} status={editor.status} error={editor.error} onSave={editor.save} onReset={editor.reset} />
    </>
  );
}
