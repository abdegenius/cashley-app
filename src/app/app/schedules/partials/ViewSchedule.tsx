"use client";

import { Detail } from "@/components/modals/ViewTransactionModal";
import useSchedule from "@/hooks/useSchedule";
import { Schedule } from "@/types/api";
import { formatToNGN } from "@/utils/amount";
import { secondsToSmartUnit } from "@/utils/date";
import { removeNum, removeString } from "@/utils/string";
import moment from "moment";
import { useEffect, useState } from "react";

interface ViewScheduleProps {
    onClose: () => void;
    schedule: Schedule;
}

export function ViewSchedule({ onClose, schedule }: ViewScheduleProps) {
    const { viewScheduleHistory } = useSchedule();
    const [history, setHistory] = useState<any[] | null>(null)

    useEffect(() => {
        if (!history || Array.isArray(history) && history.length == 0) return
        const getScheduleHistory = async () => {
            const schedule_history = await viewScheduleHistory(schedule.reference);
            if (schedule_history) {
                setHistory(schedule_history)
            }
        }
        getScheduleHistory()

    }, [schedule.reference, history, viewScheduleHistory]);

    const intervalText = secondsToSmartUnit(schedule.interval || 0);

    return (
        <div className="w-full px-4 min-h-screen bg-background">
            <div className="w-full p-4 rounded-2xl bg-card">
                <div className="w-full flex justify-end">
                    <button
                        onClick={onClose}
                        className="cursor-pointer hover:bg-background p-1 rounded-sm gradient-text-orange-to-purple transition-colors"
                    >
                        Close
                    </button>
                </div>

                <div className="w-full space-y-2">

                    <h1 className="text-2xl text-center gradient-text-purple-to-blue">
                        {schedule.title}
                    </h1>

                    <div className="w-full rounded-2xl p-2 space-y-2">
                        {schedule?.title && <Detail label="Title" value={schedule.title} />}
                        {schedule?.data?.service_id && <Detail label="Service" value={schedule.data.service_id.replaceAll("-", " ").toUpperCase().trim()} />}
                        {schedule?.data?.variation_code && <Detail label="Item" value={schedule.data.variation_code.replaceAll("-", " ").toUpperCase().trim()} />}
                        {schedule?.data?.phone && <Detail label="Recipient" value={schedule.data.phone} />}
                        {schedule?.data?.amount && <Detail label="Amount" value={formatToNGN(schedule.data.amount)} />}
                        {intervalText && <div className="flex items-center w-full justify-between">
                            <Detail
                                label="Interval"
                                value={`${removeString(intervalText)} ${removeNum(intervalText)}`}
                            />
                        </div>}
                        {schedule?.frequency && <Detail label="Frequency" value={schedule.frequency} />}
                        {schedule?.status && <Detail label="Status" value={schedule.status} />}
                        {schedule?.created_at && <Detail label="Created At" value={moment(schedule.created_at).fromNow()} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
