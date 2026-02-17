"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Star, Send, CheckCircle2, Heart } from "lucide-react";
import { toast } from "sonner";
import { useCreateRating } from "~/features/doctor/api/createRating";

interface RatingFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointmentId: string;
    doctorId: string;
    doctorName: string;
    onSuccess?: () => void;
}

export const RatingFeedbackModal = ({
    isOpen,
    onClose,
    appointmentId,
    doctorId,
    doctorName,
    onSuccess
}: RatingFeedbackModalProps) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const createRatingMutation = useCreateRating({
        mutationConfig: {
            onSuccess: () => {
                setIsSubmitted(true);
                if (onSuccess) onSuccess();

                setTimeout(() => {
                    onClose();
                    setIsSubmitted(false);
                    setRating(0);
                    setComment("");
                }, 3000);
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Gagal mengirim feedback");
            }
        }
    });

    const loading = createRatingMutation.isPending;

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Mohon berikan rating bintang");
            return;
        }

        createRatingMutation.mutate({
            data: {
                doctorId,
                rating,
                comment: comment.trim() || undefined,
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md rounded-3xl">
                {!isSubmitted ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-center">Beri Rating & Feedback</DialogTitle>
                            <DialogDescription className="text-center">
                                Bagaimana pengalaman Anda berkonsultasi dengan <span className="font-bold text-primary">{doctorName}</span>?
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6 flex flex-col items-center gap-6">
                            {/* Star Rating */}
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`p-1 transition-all duration-200 transform ${(hover || rating) >= star ? 'scale-110' : 'scale-100'
                                            }`}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            className={`h-10 w-10 ${(hover || rating) >= star
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-muted-foreground'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="w-full space-y-2">
                                <label className="text-sm font-medium px-1">Ceritakan lebih detail (Opsional)</label>
                                <Textarea
                                    placeholder="Apa yang membuat Anda puas atau apa yang bisa kami tingkatkan?"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="rounded-2xl min-h-[120px] bg-muted/30 border-none focus-visible:ring-primary"
                                />
                            </div>
                        </div>

                        <DialogFooter className="sm:justify-center">
                            <Button
                                onClick={handleSubmit}
                                className="w-full sm:w-2/3 rounded-full h-12 text-lg font-bold gap-2 shadow-lg shadow-primary/20"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>Memproses...</>
                                ) : (
                                    <>
                                        Kirim Feedback <Send className="h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="py-12 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">Terimakasih!</h3>
                        <p className="text-muted-foreground">
                            Feedback Anda sangat berharga bagi kami untuk terus meningkatkan layanan RSI Siti Hajar Mataram.
                        </p>
                        <div className="flex items-center gap-2 text-primary font-medium italic mt-4">
                            <Heart className="h-4 w-4 fill-primary" /> Salam Sehat
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
