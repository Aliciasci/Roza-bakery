"use client";

import { useState } from "react";
import { saveFaq } from "@/app/admin/actions";
import type { FaqItem } from "@/lib/types";
import { AddButton, Card, LangTabs, PageTitle, RowActions, SaveBar, Toggle, TrInput, makeId, move, useEditor, withKab, type EditLang } from "./ui";

export function FaqEditor({ initial }: { initial: FaqItem[] }) {
  const editor = useEditor(initial, saveFaq);
  const [lang, setLang] = useState<EditLang>("fr");
  const items = editor.value;
  const setItem = (i: number, patch: Partial<FaqItem>) => editor.setValue(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  return (
    <>
      <PageTitle
        title="FAQ"
        intro="Questions fréquentes. Les passages entre crochets [ ] sont surlignés comme « à compléter » sur le site."
      >
        <LangTabs value={lang} onChange={setLang} />
      </PageTitle>
      <div className="space-y-4">
        {items.map((item, i) => (
          <Card key={item.id}>
            <div className="flex items-start gap-3">
              <div className="grid flex-1 gap-4">
                <TrInput
                  lang={lang}
                  label={`Question ${i + 1}`}
                  fr={item.question}
                  kab={item.kab?.question}
                  onFr={(v) => setItem(i, { question: v })}
                  onKab={(v) => setItem(i, { kab: withKab(item, "question", v) })}
                />
                <TrInput
                  lang={lang}
                  label="Réponse"
                  multiline
                  fr={item.answer}
                  kab={item.kab?.answer}
                  onFr={(v) => setItem(i, { answer: v })}
                  onKab={(v) => setItem(i, { kab: withKab(item, "answer", v) })}
                />
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
