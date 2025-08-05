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
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to vote");
      }
      return await response.json();
    },
    onSuccess: () => {
      setVotes(prev => prev + 1);
      setHasVoted(true);
      toast({
        title: "Thank you!",
        description: "Your vote has been recorded.",
      });
      
      // Invalidate all review-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", "casino"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", "bonus"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", "game"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Unable to vote at this time.",
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
        {helpfulMutation.isPending ? "..." : `Helpful (${votes})`}
      </span>
    </Button>
  );
}