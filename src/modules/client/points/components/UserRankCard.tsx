'use client';

import React from 'react';
import type { PointsInfo } from '../services/points.service';

interface Props {
  data: PointsInfo;
}

function RankBadge({ data }: Props) {
  const { rank, progress, pointsToNextRank } = data;

  const bgGradients: Record<string, string> = {
    bronze: 'from-amber-700 via-amber-600 to-amber-800',
    silver: 'from-gray-400 via-gray-300 to-gray-500',
    gold: 'from-yellow-400 via-yellow-300 to-yellow-500',
    platinum: 'from-slate-300 via-slate-200 to-slate-400',
    diamond: 'from-cyan-300 via-blue-300 to-indigo-400',
  };

  const gradient = bgGradients[rank.rank] || bgGradients.bronze;

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header with rank gradient */}
      <div className={`bg-gradient-to-r ${gradient} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{rank.icon}</span>
            <div>
              <p className="text-white font-bold text-base leading-tight">{rank.rankName}</p>
              <p className="text-white/80 text-xs">Rank {rank.rank.charAt(0).toUpperCase() + rank.rank.slice(1)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-lg">{data.points.toLocaleString()}</p>
            <p className="text-white/80 text-xs">điểm</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {data.nextRank && (
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Tiến đến {data.nextRank.rankName}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                rank.rank === 'diamond'
                  ? 'bg-gradient-to-r from-cyan-400 to-indigo-500'
                  : rank.rank === 'gold'
                  ? 'bg-gradient-to-r from-yellow-300 to-yellow-500'
                  : 'bg-gradient-to-r from-amber-400 to-amber-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-center">
            Cần {pointsToNextRank?.toLocaleString()} điểm nữa để lên {data.nextRank.rankName}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-3 border-t border-gray-100 grid grid-cols-2 gap-3">
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{data.totalEarned.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Tổng tích lũy</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">{data.totalOrders}</p>
          <p className="text-xs text-gray-400">Đơn hàng</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-4 pb-3">
        <p className="text-xs font-medium text-gray-700 mb-1.5">Quyền lợi:</p>
        <ul className="space-y-0.5">
          {rank.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg
                className="w-3.5 h-3.5 text-green-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function UserRankCard({ data }: Props) {
  return <RankBadge data={data} />;
}
