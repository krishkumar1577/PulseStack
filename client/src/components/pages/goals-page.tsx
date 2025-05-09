"use client"

import { useState, useEffect } from "react"
import { Activity, CheckCircle2, Circle, Clock, Edit, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast, Toaster } from "sonner"

export type GoalCategory = "Project" | "Learning" | "Career" | "Community" | "Personal";
export type HabitTarget = "Every day" | "Weekdays" | "3 times per week" | "Every Sunday" | "Every Monday" | "Custom";

interface Goal {
  id: number;
  title: string;
  category: GoalCategory;
  deadline: string;
  progress: number;
  description: string;
}

interface GoalCardProps extends Omit<Goal, 'id'> {
  onDelete: () => void;
  onUpdateProgress: (progress: number) => void;
  onEdit: () => void;
}

interface HabitCardProps {
  title: string;
  streak: number;
  target: string;
  completedToday: boolean;
  description: string;
  onDelete: () => void;
  onToggle: () => void;
  onEdit: () => void;
  weeklyProgress: boolean[];
}

interface Habit {
  id: number;
  title: string;
  streak: number;
  target: string;
  completedToday: boolean;
  description: string;
  weeklyProgress: boolean[];
  lastCompletedDate: string | null;
}

export function GoalsPage() {
  const [activeTab, setActiveTab] = useState("goals")
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false)
  const [showNewHabitDialog, setShowNewHabitDialog] = useState(false)
  const [showEditGoalDialog, setShowEditGoalDialog] = useState(false)
  const [showEditHabitDialog, setShowEditHabitDialog] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [formError, setFormError] = useState("")
  const [newGoal, setNewGoal] = useState({
    title: "",
    category: "" as GoalCategory,
    deadline: "",
    description: ""
  })
  const [newHabit, setNewHabit] = useState({
    title: "",
    target: "" as HabitTarget,
    description: ""
  })
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Complete PulseStack UI",
      category: "Project",
      deadline: "April 20, 2025",
      progress: 75,
      description: "Finish implementing all UI components and pages for the PulseStack dashboard"
    },
    {
      id: 2,
      title: "Learn AI Integration",
      category: "Learning",
      deadline: "May 15, 2025",
      progress: 45,
      description: "Complete course on integrating AI models with web applications"
    },
    {
      id: 3,
      title: "Contribute to Open Source",
      category: "Community",
      deadline: "June 30, 2025",
      progress: 20,
      description: "Make 5 meaningful contributions to open source projects"
    },
    {
      id: 4,
      title: "Build Portfolio Website",
      category: "Career",
      deadline: "April 30, 2025",
      progress: 60,
      description: "Design and develop personal portfolio website showcasing projects"
    }
  ])

  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      title: "Daily Coding",
      streak: 12,
      target: "Every day",
      completedToday: true,
      description: "Write code for at least 1 hour every day",
      weeklyProgress: [true, true, false, true, true, false, true],
      lastCompletedDate: null
    },
    {
      id: 2,
      title: "Read Technical Articles",
      streak: 8,
      target: "Weekdays",
      completedToday: true,
      description: "Read at least one technical article each weekday",
      weeklyProgress: [true, true, true, false, true, false, false],
      lastCompletedDate: null
    },
    {
      id: 3,
      title: "Exercise",
      streak: 5,
      target: "3 times per week",
      completedToday: false,
      description: "30 minutes of physical activity",
      weeklyProgress: [true, false, true, false, true, false, false],
      lastCompletedDate: null
    },
    {
      id: 4,
      title: "Project Planning",
      streak: 3,
      target: "Every Sunday",
      completedToday: false,
      description: "Plan tasks and goals for the upcoming week",
      weeklyProgress: [false, true, false, true, false, false, true],
      lastCompletedDate: null
    }
  ])

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals')
    const savedHabits = localStorage.getItem('habits')
    if (savedGoals) setGoals(JSON.parse(savedGoals))
    if (savedHabits) setHabits(JSON.parse(savedHabits))
  }, [])

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals))
  }, [goals])

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  const handleDeleteGoal = (goalId: number) => {
    setGoals(goals.filter(goal => goal.id !== goalId))
  }

  const handleDeleteHabit = (habitId: number) => {
    setHabits(habits.filter(habit => habit.id !== habitId))
  }

  const handleUpdateGoalProgress = (goalId: number, newProgress: number) => {
    const goal = goals.find(g => g.id === goalId);
    const previousProgress = goal?.progress || 0;
    const updatedProgress = Math.min(100, Math.max(0, newProgress));
    
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        if (previousProgress < 100 && updatedProgress === 100) {
          toast.success("🎉 Congratulations!", {
            description: `You've completed your goal: ${goal.title}`,
          });
        }
        return { ...goal, progress: updatedProgress };
      }
      return goal;
    }));
  }

  const handleToggleHabit = (habitId: number) => {
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;

      const today = new Date().toDateString();
      const wasCompletedToday = habit.lastCompletedDate === today;
      
      if (wasCompletedToday) {
        return {
          ...habit,
          completedToday: false,
          streak: Math.max(0, habit.streak - 1),
          lastCompletedDate: null,
          weeklyProgress: habit.weeklyProgress.map((day, i) => 
            i === new Date().getDay() ? false : day
          )
        };
      }
      
      const newStreak = habit.streak + 1;
      if (newStreak === 7) {
        toast.success("🌟 One Week Streak!", {
          description: `Amazing! You've maintained ${habit.title} for 7 days straight!`
        });
      } else if (newStreak === 30) {
        toast.success("🏆 Monthly Master!", {
          description: `Incredible! You've kept up with ${habit.title} for 30 days!`
        });
      } else if (newStreak === 100) {
        toast.success("💫 Century Club!", {
          description: `Outstanding! You've maintained ${habit.title} for 100 days!`
        });
      } else if (newStreak % 50 === 0) {
        toast.success("🎯 Milestone Achieved!", {
          description: `You've maintained ${habit.title} for ${newStreak} days!`
        });
      }
      
      return {
        ...habit,
        completedToday: true,
        streak: newStreak,
        lastCompletedDate: today,
        weeklyProgress: habit.weeklyProgress.map((day, i) => 
          i === new Date().getDay() ? true : day
        )
      };
    }));
  }

  const handleCreateGoal = () => {
    setFormError("")
    if (!newGoal.title) {
      setFormError("Title is required")
      return
    }
    if (!newGoal.category) {
      setFormError("Category is required")
      return
    }
    if (!newGoal.deadline) {
      setFormError("Deadline is required")
      return
    }

    const deadline = new Date(newGoal.deadline)
    if (deadline < new Date()) {
      setFormError("Deadline cannot be in the past")
      return
    }

    setGoals([...goals, {
      id: Date.now(),
      ...newGoal,
      progress: 0
    }])
    setNewGoal({
      title: "",
      category: "" as GoalCategory,
      deadline: "",
      description: ""
    })
    setShowNewGoalDialog(false)
  }

  const handleCreateHabit = () => {
    setFormError("")
    if (!newHabit.title) {
      setFormError("Title is required")
      return
    }
    if (!newHabit.target) {
      setFormError("Target frequency is required")
      return
    }

    setHabits([...habits, {
      id: Date.now(),
      ...newHabit,
      streak: 0,
      completedToday: false,
      weeklyProgress: Array(7).fill(false),
      lastCompletedDate: null
    }])
    setNewHabit({
      title: "",
      target: "" as HabitTarget,
      description: ""
    })
    setShowNewHabitDialog(false)
  }

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal)
    setNewGoal({
      title: goal.title,
      category: goal.category,
      deadline: goal.deadline,
      description: goal.description
    })
    setShowEditGoalDialog(true)
  }

  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit)
    setNewHabit({
      title: habit.title,
      target: habit.target as HabitTarget,
      description: habit.description
    })
    setShowEditHabitDialog(true)
  }

  const handleSaveGoalEdit = () => {
    setFormError("")
    if (!newGoal.title) {
      setFormError("Title is required")
      return
    }
    if (!newGoal.category) {
      setFormError("Category is required")
      return
    }
    if (!newGoal.deadline) {
      setFormError("Deadline is required")
      return
    }

    const deadline = new Date(newGoal.deadline)
    if (deadline < new Date()) {
      setFormError("Deadline cannot be in the past")
      return
    }

    if (selectedGoal) {
      setGoals(goals.map(goal => 
        goal.id === selectedGoal.id 
          ? { ...goal, ...newGoal }
          : goal
      ))
    }
    
    setSelectedGoal(null)
    setNewGoal({
      title: "",
      category: "" as GoalCategory,
      deadline: "",
      description: ""
    })
    setShowEditGoalDialog(false)
  }

  const handleSaveHabitEdit = () => {
    setFormError("")
    if (!newHabit.title) {
      setFormError("Title is required")
      return
    }
    if (!newHabit.target) {
      setFormError("Target frequency is required")
      return
    }

    if (selectedHabit) {
      setHabits(habits.map(habit => 
        habit.id === selectedHabit.id 
          ? { 
              ...habit,
              title: newHabit.title,
              target: newHabit.target,
              description: newHabit.description
            }
          : habit
      ))
    }
    
    setSelectedHabit(null)
    setNewHabit({
      title: "",
      target: "" as HabitTarget,
      description: ""
    })
    setShowEditHabitDialog(false)
  }

  const calculateOverallProgress = () => {
    const goalProgress = goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length
    const habitProgress = habits.reduce((acc, habit) => 
      acc + (habit.weeklyProgress.filter(Boolean).length / 7) * 100, 0
    ) / habits.length
    const weeklyTarget = (goalProgress + habitProgress) / 2
    return {
      goalsCompletion: Math.round(goalProgress),
      habitConsistency: Math.round(habitProgress),
      weeklyTarget: Math.round(weeklyTarget)
    }
  }

  const progress = calculateOverallProgress()

  return (
    <div className="flex-1 overflow-auto px-6 pb-6">
      <Toaster />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Goals & Habits</h2>
        <div className="flex items-center gap-2">
          <Button 
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white"
            onClick={() => activeTab === "goals" ? setShowNewGoalDialog(true) : setShowNewHabitDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New {activeTab === "goals" ? "Goal" : "Habit"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="goals" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => (
              <GoalCard
                key={goal.id}
                {...goal}
                onDelete={() => handleDeleteGoal(goal.id)}
                onUpdateProgress={(progress) => handleUpdateGoalProgress(goal.id, progress)}
                onEdit={() => handleEditGoal(goal)}
              />
            ))}
            <div 
              onClick={() => setShowNewGoalDialog(true)}
              className="border-2 border-dashedborder rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary/70 transition-colors cursor-pointer"
            >
              <Plus className="h-8 w-8 mb-2" />
              <p className="font-medium">Add New Goal</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="habits" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                {...habit}
                onDelete={() => handleDeleteHabit(habit.id)}
                onToggle={() => handleToggleHabit(habit.id)}
                onEdit={() => handleEditHabit(habit)}
                weeklyProgress={habit.weeklyProgress}
              />
            ))}
            <div 
              onClick={() => setShowNewHabitDialog(true)}
              className="border-2 border-dashedborder rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary/70 transition-colors cursor-pointer"
            >
              <Plus className="h-8 w-8 mb-2" />
              <p className="font-medium">Add New Habit</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>Add a new goal to track your progress</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Enter goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={newGoal.category} onValueChange={(value: GoalCategory) => setNewGoal({ ...newGoal, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Community">Community</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline</label>
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter goal description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewGoalDialog(false)}>Cancel</Button>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"
              onClick={handleCreateGoal}
            >
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewHabitDialog} onOpenChange={setShowNewHabitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
            <DialogDescription>Add a new habit to track your consistency</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Enter habit title"
                value={newHabit.title}
                onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target</label>
              <Select value={newHabit.target} onValueChange={(value: HabitTarget) => setNewHabit({ ...newHabit, target: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Every day">Every day</SelectItem>
                  <SelectItem value="Weekdays">Weekdays</SelectItem>
                  <SelectItem value="3 times per week">3 times per week</SelectItem>
                  <SelectItem value="Every Sunday">Every Sunday</SelectItem>
                  <SelectItem value="Every Monday">Every Monday</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter habit description"
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewHabitDialog(false)}>Cancel</Button>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"
              onClick={handleCreateHabit}
            >
              Create Habit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditGoalDialog} onOpenChange={setShowEditGoalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>Update your goal details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Enter goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select 
                value={newGoal.category} 
                onValueChange={(value: GoalCategory) => setNewGoal({ ...newGoal, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Community">Community</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline</label>
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter goal description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditGoalDialog(false)}>Cancel</Button>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"
              onClick={handleSaveGoalEdit}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditHabitDialog} onOpenChange={setShowEditHabitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>Update your habit details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Enter habit title"
                value={newHabit.title}
                onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target</label>
              <Select 
                value={newHabit.target} 
                onValueChange={(value: HabitTarget) => setNewHabit({ ...newHabit, target: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Every day">Every day</SelectItem>
                  <SelectItem value="Weekdays">Weekdays</SelectItem>
                  <SelectItem value="3 times per week">3 times per week</SelectItem>
                  <SelectItem value="Every Sunday">Every Sunday</SelectItem>
                  <SelectItem value="Every Monday">Every Monday</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter habit description"
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditHabitDialog(false)}>Cancel</Button>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"
              onClick={handleSaveHabitEdit}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>Track your goals and habits progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Goals Completion</h4>
                <span className="text-sm text-muted-foreground">{progress.goalsCompletion}%</span>
              </div>
              <Progress value={progress.goalsCompletion} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Habit Consistency</h4>
                <span className="text-sm text-muted-foreground">{progress.habitConsistency}%</span>
              </div>
              <Progress value={progress.habitConsistency} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Weekly Target</h4>
                <span className="text-sm text-muted-foreground">{progress.weeklyTarget}%</span>
              </div>
              <Progress value={progress.weeklyTarget} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function GoalCard({ title, category, deadline, progress, description, onDelete, onUpdateProgress, onEdit }: GoalCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-secondary/50">
            {category}
          </Badge>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={onEdit}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Goal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Goal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardTitle className="text-lg mt-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{progress}% Complete</span>
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {deadline}
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Progress value={progress} className="h-2" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{progress}% Complete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => onUpdateProgress(progress + 5)}>
          Update Progress
        </Button>
      </CardFooter>
    </Card>
  )
}

function HabitCard({ title, streak, target, completedToday, description, onDelete, onToggle, onEdit, weeklyProgress }: HabitCardProps) {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {completedToday ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground mr-2" />
            )}
            <span className="text-sm text-muted-foreground">{target}</span>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={onEdit}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Habit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Habit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardTitle className="text-lg mt-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{streak} day streak</span>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayLabels.map((day, i) => (
              <div key={day} className="text-center text-xs text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weeklyProgress.map((isCompleted, i) => (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`h-8 rounded-md flex items-center justify-center ${
                        isCompleted ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{dayLabels[i]}: {isCompleted ? 'Completed' : 'Not Completed'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={completedToday ? "outline" : "default"}
          className={`w-full ${completedToday ? "" : "bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"}`}
          onClick={onToggle}
        >
          {completedToday ? "Completed Today" : "Mark Complete"}
        </Button>
      </CardFooter>
    </Card>
  )
}
