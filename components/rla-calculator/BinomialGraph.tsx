import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Plugin
} from 'chart.js'
import { memoizedBinomialProbability } from './math'

const horizontalLinePlugin: Plugin<
  'bar',
  { yValue: number; color?: string; lineWidth?: number }
> = {
  id: 'horizontalLine',
  afterDraw: (chart, _, options) => {
    const { ctx, scales } = chart
    const { yValue, color, lineWidth } = options

    const yAxis = scales.y
    if (!yAxis) return

    const y = yAxis.getPixelForValue(yValue)

    ctx.save()
    ctx.strokeStyle = color || 'rgba(0, 0, 0, 0.5)'
    ctx.lineWidth = lineWidth || 1
    ctx.beginPath()
    ctx.moveTo(scales.x.left, y)
    ctx.lineTo(scales.x.right, y)
    ctx.stroke()
    ctx.restore()
  }
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  horizontalLinePlugin
)

const withinMarginColor = 'hsla(222, 100%, 60%, 0.6)'
const exceededMarginColor = 'hsla(222, 100%, 30%, 0.8)'

export const BinomialGraph = ({
  n,
  k,
  total,
  confidence,
  marginOfError,
  scaleGraph
}) => {
  const maxX = (k + 3) * 3
  const pmf = [...Array(Math.min(n + 1, maxX))].map(
    (_, i) => memoizedBinomialProbability(n, i, k / n) * 100
  )
  const Xs = [...Array(n + 1)].map((_, i) =>
    scaleGraph ? Math.round(i * (total / n)) : i
  )
  let memo = 0

  if (k === 0 || k === n)
    return (
      <div className='mt-2 text-sm italic opacity-60'>
        <b>Warning:</b> With Compromises Seen = {k === 0 ? '0' : 'Samples'}, the
        binomial distribution graph is 100% concentrated on one end and cannot
        provide meaningful insights.
      </div>
    )

  return (
    <div>
      <div>
        <Bar
          height={300}
          data={{
            labels: Xs,
            datasets: [
              {
                label: 'Binomial Probability',
                data: pmf,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              },
              {
                label: 'Cumulative Binomial Probability',
                data: pmf.map((p) => (memo += p)),
                backgroundColor: pmf.map((_, i) =>
                  i <= (marginOfError * n) / total
                    ? withinMarginColor
                    : exceededMarginColor
                ),
                borderColor: 'hsla(222, 100%, 70%, 60%)',
                borderWidth: 1
              }
            ]
          }}
          options={{
            elements: { bar: { borderWidth: 20 } },
            maintainAspectRatio: false,
            scales: {
              x: {
                max: Xs[maxX],
                title: {
                  display: true,
                  text: `Estimated # of Compromised Votes ${
                    scaleGraph
                      ? `in ${total.toLocaleString()} Total`
                      : `per ${n} sampled`
                  }`
                }
              },
              y: {
                max: 100,
                title: {
                  display: true,
                  text: 'Probability %'
                }
              }
            },
            plugins: {
              // @ts-expect-error
              horizontalLine: {
                yValue: confidence * 100,
                color: 'hsla(120, 100%, 40%, 0.5)',
                lineWidth: 2
              },
              tooltip: {
                callbacks: {
                  title: ([point]) => {
                    const kValue = point.label
                    const isCumulative =
                      point.dataset.label === 'Cumulative Binomial Probability'
                    return `${isCumulative ? '' : 'Exactly '}${kValue}${
                      isCumulative ? ' or less' : ''
                    } Compromised Votes ${
                      scaleGraph
                        ? `in ${total.toLocaleString()} Total`
                        : `per ${n} sampled`
                    }`
                  },
                  label: (point) =>
                    `${point.dataset.label}: ${point.formattedValue}%`
                }
              }
            }
          }}
        />
      </div>

      {/* Legend: Margin of Error Cutoff */}
      <p className='mt-2 text-xs text-center text-black/50 dark:text-white/60'>
        <span
          className='w-[8px] h-[8px] inline-block mb-px mr-1'
          style={{ backgroundColor: withinMarginColor }}
        />
        Within Margin of Error
        <span
          className='w-[8px] h-[8px] inline-block mb-px ml-3 mr-1'
          style={{ backgroundColor: exceededMarginColor }}
        />
        Exceeded Margin of Error
      </p>
    </div>
  )
}
