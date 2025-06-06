"use client";
import { MouseEffectCard } from '@/components/MouseEffectCard'
export default function BancosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <MouseEffectCard className="rounded-xl p-5 bg-muted/10" children={undefined}>
		{/* conteúdo */}
		</MouseEffectCard>
		<MouseEffectCard className="rounded-xl p-5 bg-muted/10" children={undefined}>
		{/* conteúdo */}
		</MouseEffectCard>
      </div>
      <div className="bg-muted/50 min-h-[40vh] flex-1 rounded-xl md:min-h-min p-5">
        teste
      </div>
    </div>
  )
}