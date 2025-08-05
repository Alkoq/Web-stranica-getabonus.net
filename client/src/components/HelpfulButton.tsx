import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface HelpfulButtonProps {
  reviewId: string;
  initialHelpfulVotes: number;
  variant?: "default" | "outline";
  size?: "sm" | "default";
}

export function HelpfulButton({ 
  reviewId, 
  initialHelpfulVotes, 
  variant = "outline",
  size = "sm" 
}: HelpfulButtonProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState(initialHelpfulVotes);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const helpfulMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      setVotes(prev => prev + 1);
      setHasVoted(true);
      toast({
        title: "Hvala!",
        description: "Vaš glas je zabeležen.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Nije moguće glasati u ovom trenutku.",
        variant: "destructive",
      });
    },
  });

  const handleHelpfulClick = () => {
    if (hasVoted || helpfulMutation.isPending) return;
    helpfulMutation.mutate();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleHelpfulClick}
      disabled={hasVoted || helpfulMutation.isPending}
      className={`gap-1 ${hasVoted ? 'bg-turquoise-500 text-white' : ''}`}
      data-testid={`button-helpful-${reviewId}`}
    >
      <ThumbsUp className="h-3 w-3" />
      <span className="text-xs">
        {helpfulMutation.isPending ? "..." : `Korisno (${votes})`}
      </span>
    </Button>
  );
}