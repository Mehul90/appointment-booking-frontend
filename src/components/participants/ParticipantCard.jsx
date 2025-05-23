import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Mail, Phone, Building2, Edit, CalendarClock } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ParticipantCard({
    participant,
    appointmentsCount,
    onEdit,
    onDelete,
    onViewAppointments,
}) {
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase();
    };

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-0">
                <div className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback
                                    style={{ backgroundColor: participant.color }}
                                    className="text-white text-lg font-medium"
                                >
                                    {getInitials(participant.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-medium">{participant.name}</h3>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onEdit(participant)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete(participant.id)}
                                    className="text-red-600"
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 text-gray-500 mr-2" />
                            <a
                                href={`mailto:${participant.email}`}
                                className="text-gray-700 hover:text-indigo-600"
                            >
                                {participant.email}
                            </a>
                        </div>

                        {/* {participant.phone && ( */}
                        <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                            {participant.phone ? (
                                <a
                                    href={`tel:${participant.phone}`}
                                    className="text-gray-700 hover:text-indigo-600"
                                >
                                    {participant.phone}
                                </a>
                            ) : (
                                "-"
                            )}
                        </div>
                        {/* )} */}

                        {participant.department && (
                            <div className="flex items-center text-sm">
                                <Building2 className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-gray-700">{participant.department}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t px-5 py-3 bg-gray-50 flex justify-between items-center">
                    <Badge variant="outline" className="flex items-center">
                        <CalendarClock className="h-3 w-3 mr-1" />
                        {appointmentsCount} appointment{appointmentsCount !== 1 ? "s" : ""}
                    </Badge>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(participant)}
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                    >
                        <Edit className="h-4 w-4 mr-1.5" />
                        Edit
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
