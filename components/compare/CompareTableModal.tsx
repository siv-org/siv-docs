import { Fragment, useReducer, useState } from 'react'
import { useEffect, useCallback } from 'react'

import { Score, tableData } from './compare-data'
import { BountyRewardsSwitch } from './BountyRewardsSwitch'
import { Switch } from './Switch'
import { interpolateColor } from './interpolate-color'

const getScore = (s: Score): number => (typeof s === 'number' ? s : s[0])

const methods = ['SIV', 'Mail', 'In Person']

type OpenedModalIndex = [number, number, number] | null

export const CompareTableModal = (): JSX.Element => {
  const [bountyEnabled, toggleBounty] = useReducer((t) => !t, true)
  const [isDescriptionShown, toggleDescription] = useReducer((t) => !t, true)
  const [openedModalIndex, setOpenedModalIndex] =
    useState<OpenedModalIndex>(null)
  function getModalContent(openedModalIndex: OpenedModalIndex) {
    if (!openedModalIndex) return null
    const [cat_index, row_index, col_index] = openedModalIndex

    const cat = tableData[cat_index]
    const row = cat.rows[row_index]
    const scores = bountyEnabled
      ? row.scores_with_bounty || row.scores
      : row.scores
    const score = scores[col_index]

    return {
      d_name: row.d_name,
      title: `${methods[col_index]} - ${row.d_name}: ${getScore(score)} / 10`,
      advantages: score[1]?.adv || '',
      disadvantages: score[1]?.disadv || ''
    }
  }
  const modalContent = getModalContent(openedModalIndex)

  const closeModal = () => setOpenedModalIndex(null)
  const goRight = useCallback(() => {
    setOpenedModalIndex(([catIndex, rowIndex, colIndex]) => {
      if (colIndex + 1 >= methods.length) return [catIndex, rowIndex, colIndex] // Stop if reached rightmost column

      return [catIndex, rowIndex, colIndex + 1]
    })
  }, [])

  const goLeft = useCallback(() => {
    setOpenedModalIndex(([catIndex, rowIndex, colIndex]) => {
      if (colIndex === 0) return [catIndex, rowIndex, colIndex] // Stop if reached leftmost column

      return [catIndex, rowIndex, colIndex - 1]
    })
  }, [])

  const goDown = useCallback(() => {
    setOpenedModalIndex(([catIndex, rowIndex, colIndex]) => {
      const nextRowIndex = rowIndex + 1

      // Increment rows within category if possible
      if (nextRowIndex < tableData[catIndex].rows.length)
        return [catIndex, nextRowIndex, colIndex]

      // Otherwise go to next category
      if (catIndex + 1 < tableData.length) return [catIndex + 1, 0, colIndex]

      // Stop if we reached the last row
      return [catIndex, rowIndex, colIndex]
    })
  }, [])
  const goUp = useCallback(() => {
    setOpenedModalIndex(([catIndex, rowIndex, colIndex]) => {
      const previousRowIndex = rowIndex - 1

      // Decrement rows within category if possible
      if (previousRowIndex >= 0) {
        return [catIndex, previousRowIndex, colIndex]
      }

      // Otherwise, go to the previous category's last row
      if (catIndex - 1 >= 0) {
        const prevCatLastRowIndex = tableData[catIndex - 1].rows.length - 1
        return [catIndex - 1, prevCatLastRowIndex, colIndex]
      }

      // Stop if we reached the first row
      return [catIndex, rowIndex, colIndex]
    })
  }, [])

  const handleKeyDown = useCallback(
    (event) => {
      if (!openedModalIndex) return

      if (event.key.startsWith('Arrow')) event.preventDefault()

      if (event.key === 'ArrowRight') goRight()
      if (event.key === 'ArrowLeft') goLeft()
      if (event.key === 'ArrowDown') goDown()
      if (event.key === 'ArrowUp') goUp()
    },
    [openedModalIndex]
  )
  // Activate keyboard shortcuts
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <main>
      {/* Main page (not modal) */}
      <section className='mb-44'>
        {/* "Intro" box */}
        <div className='inline-block p-3 mt-2 mb-8 rounded bg-blue-400/10 dark:bg-white/10'>
          {/* Show Descriptions toggle */}
          <div className='inline-block px-3 py-1 text-sm italic border rounded dark:bg-blue-900/50 bg-blue-200/70 border-black/5 text-black/70 dark:border-gray-600 dark:text-white/70'>
            <Switch
              checked={isDescriptionShown}
              onClick={toggleDescription}
              label='Show Descriptions'
            />
          </div>

          <p className='mt-3 text-sm italic text-black/70 dark:text-white/70'>
            <span className='pr-1.5 not-italic'>&#9432;</span>
            Click on scores for explanations.
          </p>
        </div>

        <table>
          <thead className='hidden sm:table-header-group'>
            <tr>
              <th className='text-left min-w-[120px]'></th>
              <th className='w-[12%] border-x-[14px] border-white dark:border-[rgb(17,17,17)] bg-gray-100 dark:bg-gray-700 sticky top-16'>
                {methods[0]}
              </th>
              <th className='w-[12%] border-x-[14px] border-white dark:border-[rgb(17,17,17)] bg-gray-100 dark:bg-gray-700 sticky top-16'>
                {methods[1]}
              </th>
              <th
                className={`w-[12%] border-x-[14px] border-white dark:border-[rgb(17,17,17)] bg-gray-100 dark:bg-gray-700 sticky top-16 px-1 ${
                  isDescriptionShown ? 'text-[14px]' : 'text-[12px]'
                }`}
              >
                {methods[2]}
              </th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((cat, c_i) => (
              <Fragment key={c_i}>
                {/* Category label */}
                <tr>
                  <td>
                    <div
                      className={`w-48 py-1.5 pl-2 font-semibold bg-gray-200/50 dark:bg-gray-800 relative top-3 mb-2 ${
                        c_i === 0 ? '-mt-6' : 'mt-10 sm:mt-0'
                      }`}
                    >
                      {cat.name}
                    </div>
                  </td>
                </tr>

                {cat.rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-white dark:border-[rgb(17,17,17)] sm:hover:bg-gray-200/30 sm:dark:hover:bg-gray-500/30 ${
                      isDescriptionShown && 'border-y-[14px]'
                    } sm:table-row flex flex-wrap`}
                  >
                    <td
                      className={`${
                        isDescriptionShown ? 'py-3' : 'pt-6 pb-1.5 sm:py-0'
                      } pr-10 pl-2 sm:w-auto w-full`}
                    >
                      <div className='text-lg font-bold leading-[18px]'>
                        {row.d_name}{' '}
                        {row.d_name === 'Coercion resistance' && (
                          <BountyRewardsSwitch
                            {...{ bountyEnabled, toggleBounty }}
                          />
                        )}
                      </div>
                      {isDescriptionShown && (
                        <div className='font-light text-justify opacity-80'>
                          {row.desc}
                        </div>
                      )}
                    </td>
                    {[
                      ...(bountyEnabled && row.scores_with_bounty
                        ? row.scores_with_bounty
                        : row.scores)
                    ].map((s, j) => (
                      <td
                        className='w-24 p-2 text-center text-black sm:w-auto'
                        key={j}
                      >
                        <div className='py-0.5 text-[13px] px-1 font-semibold bg-gray-200/70 dark:bg-gray-700 dark:text-white text-black/80 sm:hidden'>
                          {methods[j]}
                        </div>
                        <div
                          className={`${
                            isDescriptionShown ? 'py-4' : 'py-1'
                          } cursor-pointer border sm:rounded-none rounded-b-lg hover:opacity-70 font-[500] ${
                            openedModalIndex &&
                            arraysEqual(openedModalIndex, [c_i, i, j]) &&
                            'ring-2 ring-cyan-800 dark:ring-white'
                          }`}
                          style={{
                            backgroundColor: interpolateColor(getScore(s)),
                            borderColor: getScore(s) === 5 ? undefined : '#fff0'
                          }}
                          onClick={() => setOpenedModalIndex([c_i, i, j])}
                        >
                          {getScore(s)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal */}
      {!!modalContent && (
        // Outer container
        <div
          className='fixed inset-0 z-10 overflow-y-auto'
          onClick={closeModal}
        >
          {/* Center contents on small screens */}
          <div className='flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 transition-opacity'
              aria-hidden='true'
            >
              <div className='absolute inset-0 opacity-50 bg-zinc-900'></div>
            </div>
            <div
              className='inline-block overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-zinc-800 rounded-lg shadow-xl sm:my-20 sm:align-middle sm:max-w-xl sm:w-full pt-[5px] overflow-y-auto max-h-[70vh]'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='relative px-4 pt-5 pb-4 bg-white dark:bg-zinc-800 sm:p-6 sm:pb-4'>
                {/* Prev arrow */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='absolute w-6 h-6 text-gray-500 transform -translate-y-1/2 cursor-pointer left-1 top-1/2 hover:text-gray-700'
                  fill='currentColor'
                  onClick={goLeft}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>

                {/* Next arrow */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='absolute w-6 h-6 text-gray-500 transform -translate-y-1/2 cursor-pointer right-1 top-1/2 hover:text-gray-700'
                  onClick={goRight}
                  fill='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>

                {/* Close X btn */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  className='absolute w-6 h-6 cursor-pointer text-zinc-500 top-4 right-4 hover:text-gray-700'
                  onClick={closeModal}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>

                {/* Modal Content */}
                <div className='sm:flex sm:items-start'>
                  <div className='mt-3 text-left sm:mt-0 sm:ml-4'>
                    <h3 className='text-lg font-medium leading-6 text-gray-900 dark:text-gray-100'>
                      {modalContent.title}
                      {modalContent.d_name === 'Coercion resistance' && (
                        <BountyRewardsSwitch
                          {...{ bountyEnabled, toggleBounty }}
                        />
                      )}
                    </h3>
                    <div className='mt-2 text-sm text-sky-900 dark:text-sky-200'>
                      <div className='mt-3 mb-1 text-xs text-teal-900/80 dark:text-teal-100/80'>
                        Advantages:
                      </div>
                      {modalContent.advantages
                        .split('\n')
                        .map((c) => c.trim())
                        .filter((c) => c)
                        .map((advantage, index) => (
                          <div className='mb-2' key={index}>
                            <span className='text-[18px] font-bold text-green-700'>
                              +
                            </span>{' '}
                            {advantage}
                          </div>
                        ))}
                      <div className='mt-3 mb-1 text-xs opacity-60 dark:text-teal-100/80'>
                        Disadvantages:
                      </div>
                      {modalContent.disadvantages
                        .split('\n')
                        .map((c) => c.trim())
                        .filter((c) => c)
                        .map((disadvantage, index) => (
                          <div className='mb-2' key={index}>
                            <span className='text-[18px] font-bold text-red-700'>
                              –
                            </span>{' '}
                            {disadvantage}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal bottom row */}
              <div className='px-4 py-3 bg-gray-50 dark:bg-zinc-700 sm:px-6 sm:flex sm:flex-row-reverse'>
                <span className='flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto'>
                  <button
                    onClick={() => setOpenedModalIndex(null)}
                    className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue sm:text-sm sm:leading-5'
                  >
                    Close
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }

  return true
}
