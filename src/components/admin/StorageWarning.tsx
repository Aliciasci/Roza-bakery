import { storageStatus } from "@/server/data-dir";

/** Alerte affichée dans l'admin si les données ne sont pas sur un volume persistant. */
export function StorageWarning() {
  const status = storageStatus();
  if (status.ok) return null;

  return (
    <div role="alert" className="mb-8 rounded-2xl border border-berry/30 bg-berry/8 p-5 text-sm leading-relaxed text-chocolate">
      <p className="font-semibold text-berry">⚠️ Les photos et modifications seront effacées au prochain déploiement</p>
      {status.problem === "no-volume" ? (
        <p className="mt-2">
          Aucun volume n&apos;est attaché au service Railway. Dans Railway : <strong>Settings → Volumes → Add Volume</strong>, chemin de
          montage <code className="rounded bg-paper px-1">/data</code>, puis redéployez. Ensuite, renvoyez les photos.
        </p>
      ) : (
        <p className="mt-2">
          Les données sont écrites dans <code className="rounded bg-paper px-1">{status.dir}</code>, mais le volume Railway est monté sur{" "}
          <code className="rounded bg-paper px-1">{status.volume}</code>. Dans Railway, <strong>supprimez la variable DATA_DIR</strong>{" "}
          (le volume est alors utilisé automatiquement) ou donnez-lui la valeur{" "}
          <code className="rounded bg-paper px-1">{status.volume}</code>, puis redéployez.
        </p>
      )}
    </div>
  );
}
