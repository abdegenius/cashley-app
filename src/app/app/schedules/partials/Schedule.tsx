"use client";

import Button from "@/components/ui/Button";
import { Plus, X, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { Detail } from "@/components/modals/ViewTransactionModal";
import useSchedule from "@/hooks/useSchedule";
import {
    secondsToSmartUnit
} from "@/utils/date";
import { removeNum, removeString } from "@/utils/string";
import { AnimatePresence, motion } from "framer-motion";
import { AddSchedule } from "./AddSchedule";

export interface ScheduleProps {
    type: string;
}

interface ScheduleData {
    data: {
        id: number;
        title: string;
        phone: string;
        label: string;
        interval: number;
        duraton: string;
        frequency: string;
        status: string;
        description: string;
        service_name: string;
        variation_code: string;
    };
    reference: string;
}

interface ViewScheduleProps {
    close: Dispatch<SetStateAction<null | number>>;
    schedule: ScheduleData;
}

export function Schedule({ type: _type }: ScheduleProps) {
    const { schedules, fetchSchedules, deleteSchedule } = useSchedule();
    const [toggleAdd, setToggleAdd] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
    const [reference, setReference] = useState<string | null>(null);
    const [type, setType] = useState<string>(_type)
    const handleSetType = async (_type: string) => {
        await fetchSchedules(_type);
        setType(_type)
    }

    useEffect(() => {
        if (!schedules)
            fetchSchedules(type);
    }, [type, schedules, fetchSchedules]);

    const viewSchedule = useMemo(() =>
        schedules?.find(schedule => schedule.reference === selectedSchedule),
        [schedules, selectedSchedule]
    );

    const handleDeleteSchedule = useCallback(async (reference: string) => {
        await deleteSchedule(reference);
    }, [deleteSchedule]);

    if (viewSchedule) {
        return <ViewSchedule close={setSelectedSchedule} schedule={viewSchedule} />;
    }

    const services = [
        { id: "", "name": "All" },
        // { id: "intra", "name": "Tag Transfer" },
        // { id: "inter", "name": "Bank Transfer" },
        { id: "airtime", "name": "Airtime Purchase" },
        { id: "data", "name": "Data Subscription" },
        { id: "electricity", "name": "Electricity Bill" },
        { id: "tv", "name": "TV Subscription" },
        // { id: "betting", "name": "Betting Topup" }
    ];
    return (
        <div className="w-full flex flex-col space-y-2 p-4">
            <Header type={type} toggleAdd={toggleAdd} setToggleAdd={setToggleAdd} />

            <div className="w-full flex flex-row items-center justify-start overflow-x-auto gap-3">
                {services.map((service, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleSetType(service.id)}
                        className={`
                text-sm flex-none font-medium text-center py-2 px-4 rounded-full
                transition-all
                ${type === service.id ? "bg-purple-700 text-white" : "bg-stone-800 text-stone-300"}
            `}
                    >
                        {service.name}
                    </button>
                ))}
            </div>

            <div className="flex justify-between flex-col w-full min-h-150">
                {toggleAdd ? (
                    <div className="flex items-center justify-center">
                        <AddSchedule type={type} close={setToggleAdd} />
                    </div>
                ) : (
                    !schedules ?
                        <p className="w-full text-center py-12 text-stone-600">Loading schedules..</p>
                        :
                        schedules.length === 0 ?
                            <p className="w-full text-center py-12 text-stone-600">No schedules yet..</p>
                            :
                            <ScheduleList
                                schedules={schedules}
                                setSelectedSchedule={setSelectedSchedule}
                                setReference={setReference}
                            />
                )}
            </div>

            <DeleteSchedule reference={reference} setReference={setReference} onDelete={handleDeleteSchedule} />
        </div>
    );
}

const Header = ({ type, toggleAdd, setToggleAdd }: {
    type: string;
    toggleAdd: boolean;
    setToggleAdd: Dispatch<SetStateAction<boolean>>;
}) => (
    <div className="flex justify-between w-full items-center mb-6">
        <h1 className="text-center gradient-text-purple-to-blue text-3xl">Schedules</h1>

        {
            type && <button
                onClick={() => setToggleAdd(!toggleAdd)}
                className="cursor-pointer transition-transform px-4 bg-black/20 rounded-full py-2"
            >
                {toggleAdd ?
                    <div className="flex space-x-2 items-center">
                        <X size={20} color="red" />
                        <span className="text-red-600 text-xs font-medium">CLOSE</span>
                    </div>
                    :
                    <div className="flex space-x-2 items-center">
                        <Plus size={20} color="skyblue" />
                        <span className="text-sky-300 text-xs font-medium">CREATE NEW</span>
                    </div>
                }
            </button>
        }
    </div>
);

const ScheduleList = ({
    schedules,
    setSelectedSchedule,
    setReference
}: {
    schedules: any[];
    setSelectedSchedule: Dispatch<SetStateAction<number | null>>;
    setReference: Dispatch<SetStateAction<string | null>>;
}) => (
    <div className="w-full space-y-4 mt-4">
        {schedules?.map((schedule, index) => (
            <ScheduleCard
                key={schedule.reference || index}
                schedule={schedule}
                onSelect={setSelectedSchedule}
                onDelete={setReference}
            />
        ))}
    </div>
);

const ScheduleCard = ({
    schedule,
    onSelect,
    onDelete
}: {
    schedule: any;
    onSelect: (ref: number) => void;
    onDelete: (ref: string) => void;
}) => {
    const intervalText = secondsToSmartUnit(schedule.data?.interval || 0);

    return (
        <div
            onClick={() => onSelect(schedule?.reference)}
            className="w-full rounded-2xl relative bg-card px-2 py-4 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(schedule.reference);
                }}
                className="items-center flex justify-center bg-red-100 w-8 h-8 absolute right-0 top-0 transition-colors hover:bg-red-500/10 p-1 rounded"
            >
                <Trash2 color="red" className="" size={16} />
            </button>
            <div className="relative space-y-1">
                <CardBody schedule={schedule} intervalText={intervalText} />
            </div>
        </div>
    );
};

const CardBody = ({ schedule, intervalText }: { schedule: any; intervalText: string }) => {
    const { updateScheduleStatus, isRunning } = useSchedule();
    return (
        <div className="flex w-full items-end justify-between">
            <div className="flex w-full gap-2">
                <div className="w-[120px] flex flex-col items-center justify-center space-y-2">
                    <IntervalDisplay intervalText={intervalText} />
                    <ToggleSwitch
                        reference={schedule.reference}
                        isRunning={isRunning(schedule.reference)}
                        onToggle={updateScheduleStatus}
                    />
                </div>
                <ScheduleDetails schedule={schedule} />
            </div>
        </div>
    );
};

const ToggleSwitch = ({
    reference,
    isRunning,
    onToggle
}: {
    reference: string;
    isRunning: boolean;
    onToggle: (ref: string) => void;
}) => (
    <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full p-1 rounded-full max-w-13 flex ${isRunning ? "justify-end bg-white/20" : "justify-start bg-background"
            } items-center`}
    >
        <button
            onClick={() => onToggle(reference)}
            className={`rounded-full h-5 w-5 transition-all ${isRunning ? "primary-purple-to-blue" : "bg-card"
                }`}
        />
    </div>
);

const IntervalDisplay = ({ intervalText }: { intervalText: string }) => (
    <div className="flex items-center justify-center text-center flex-col w-full">
        <h2 className="text-4xl gradient-text-orange-to-purple">
            {removeString(intervalText)}
        </h2>
        <h6 className="text-lg uppercase">{removeNum(intervalText)}</h6>
    </div>
);

const ScheduleDetails = ({ schedule }: { schedule: any }) => (
    <div className="border-l border-dashed border-stone-400 space-y-1 px-8 w-full">
        {schedule?.data?.title && <DetailRow label="Title:" value={schedule.data?.title} />}
        {schedule?.data?.service_name && <DetailRow label="Service:" value={schedule.data?.service_name.replaceAll("-", " ").toUpperCase().trim()} />}
        {schedule?.data?.variation_code && <DetailRow label="Variation:" value={schedule.data?.variation_code.replaceAll("-", " ").toUpperCase().trim()} />}
        {schedule.data?.amount && (
            <DetailRow label="Amount" value={schedule.data?.amount} />
        )}
        {schedule?.data?.phone && <DetailRow label="Recipient:" value={schedule.data?.phone} />}
        {schedule?.data?.frequency && <DetailRow label="Frequency:" value={schedule.data?.frequency} />}
        {schedule?.data?.status && <StatusRow status={schedule.data?.status || schedule.status} />}
    </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-stone-400">{label}</div>
        <div className="text-sm truncate">{value}</div>
    </div>
);

const StatusRow = ({ status }: { status: string }) => (
    <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-stone-400">Status:</div>
        <div className={`text-sm ${status === "running" ? "text-green-500" : "text-yellow-500"
            }`}>
            {status}
        </div>
    </div>
);

const DeleteSchedule = ({
    reference,
    setReference,
    onDelete
}: {
    reference: string | null;
    setReference: Dispatch<SetStateAction<string | null>>;
    onDelete: (ref: string) => void;
}) => (
    <AnimatePresence>
        {reference && (
            <ModalOverlay onClose={() => setReference(null)}>
                <motion.div
                    initial={{ y: 300, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 300, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="grid sm:max-w-md mx-auto gap-4 w-full p-6 rounded-t-2xl sm:rounded-2xl bg-card relative z-20 shadow-2xl"
                >
                    <h1 className="text-center text-xl font-semibold">Are you sure?</h1>
                    <p className="text-center text-stone-400 text-sm">
                        This action cannot be undone. The schedule will be permanently deleted.
                    </p>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => setReference(null)}
                            className="flex-1 p-3 rounded-xl bg-stone-700 hover:bg-stone-600 transition-colors text-lg font-semibold text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onDelete(reference);
                                setReference(null);
                            }}
                            className="flex-1 p-3 rounded-xl bg-red-500 hover:bg-red-600 transition-colors text-lg font-semibold text-white"
                        >
                            Delete
                        </button>
                    </div>
                </motion.div>
            </ModalOverlay>
        )}
    </AnimatePresence>
);

const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-screen fixed top-0 left-0 flex items-end sm:items-center justify-center bg-black/50 z-50"
    >
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full absolute top-0 left-0 backdrop-blur-xl"
            onClick={onClose}
        />
        {children}
    </motion.div>
);

function ViewSchedule({ close, schedule }: ViewScheduleProps) {
    const { viewScheduleHistory } = useSchedule();
    const [history, setHistory] = useState<any[] | null>(null)

    useEffect(() => {
        if (history) return;
        const getScheduleHistory = async () => {
            const schedule_history = await viewScheduleHistory(schedule.reference);
            if (schedule_history) {
                setHistory(schedule_history)
            }
        }
        getScheduleHistory()
    }, [schedule.reference, history, viewScheduleHistory]);

    const intervalText = secondsToSmartUnit(schedule.data?.interval || 0);

    return (
        <div className="w-full px-4 min-h-screen bg-background">
            <div className="w-full p-4 rounded-2xl bg-card">
                <div className="w-full flex justify-end">
                    <button
                        onClick={() => close(null)}
                        className="cursor-pointer hover:bg-background p-1 rounded-sm gradient-text-orange-to-purple transition-colors"
                    >
                        Close
                    </button>
                </div>

                <div className="w-full space-y-2">

                    <h1 className="text-2xl text-center gradient-text-purple-to-blue">
                        {schedule.data?.description}
                    </h1>

                    <div className="w-full rounded-2xl p-2 space-y-2">
                        {schedule?.data?.title && <Detail label="Title" value={schedule.data?.title} />}
                        {schedule?.data?.service_name && <Detail label="Service" value={schedule.data?.service_name.replaceAll("-", " ").toUpperCase().trim()} />}
                        {schedule?.data?.variation_code && <Detail label="Item" value={schedule.data?.variation_code.replaceAll("-", " ").toUpperCase().trim()} />}
                        {schedule?.data?.phone && <Detail label="Recipient" value={schedule.data?.phone} />}
                        {intervalText && <div className="flex items-center w-full justify-between">
                            <Detail
                                label="Interval"
                                value={`${removeString(intervalText)} ${removeNum(intervalText)}`}
                            />
                        </div>}
                        {schedule?.data?.frequency && <Detail label="Frequency" value={schedule.data?.frequency} />}
                        {schedule?.data?.status && <Detail label="Status" value={schedule.data?.status} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

