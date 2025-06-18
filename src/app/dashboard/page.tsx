import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PlusCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { McqActionsDropdown } from '@/components/dashboard/McqActionsDropdown';

export default async function UserDashboard() {
  await dbConnect();
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'user') redirect(`/${user.role}`);

  const myMcqs = await Mcq.find({ createdBy: user._id })
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();

  // Calculate statistics
  const totalMcqs = myMcqs.length;
  const pendingMcqs = myMcqs.filter(mcq => mcq.status === 'pending').length;
  const approvedMcqs = myMcqs.filter(mcq => mcq.status === 'approved').length;
  const rejectedMcqs = myMcqs.filter(mcq => mcq.status === 'rejected').length;
  const approvalRate = totalMcqs > 0 ? Math.round((approvedMcqs / totalMcqs) * 100) : 0;

  // Group MCQs by status
  const pendingList = myMcqs.filter(mcq => mcq.status === 'pending');
  const approvedList = myMcqs.filter(mcq => mcq.status === 'approved');
  const rejectedList = myMcqs.filter(mcq => mcq.status === 'rejected');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground">Manage your submitted multiple choice questions</p>
        </div>
        <Link href="/mcqs/add">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New MCQ
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Submitted</CardDescription>
            <CardTitle className="text-4xl">{totalMcqs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              All your MCQs submissions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-4xl">{pendingMcqs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">
                Waiting for approval
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-4xl">{approvedMcqs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">
                Accepted questions
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-4xl">{rejectedMcqs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">
                Needs revision
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Approval Progress</CardTitle>
            <CardDescription>
              {approvalRate}% of your MCQs have been approved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={approvalRate} className="h-2" />
          </CardContent>
        </Card>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending ({pendingMcqs})
              </div>
            </TabsTrigger>
            <TabsTrigger value="approved">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approved ({approvedMcqs})
              </div>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Rejected ({rejectedMcqs})
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingList.map((mcq) => (
                      <TableRow key={mcq._id.toString()}>
                        <TableCell className="font-medium">
                          {mcq.statement.length > 50 
                            ? `${mcq.statement.substring(0, 50)}...` 
                            : mcq.statement}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {mcq.category?.name || 'Uncategorized'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(mcq.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <McqActionsDropdown 
                            mcqId={mcq._id.toString()} 
                            status={mcq.status} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingList.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No pending MCQs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedList.map((mcq) => (
                      <TableRow key={mcq._id.toString()}>
                        <TableCell className="font-medium">
                          {mcq.statement.length > 50 
                            ? `${mcq.statement.substring(0, 50)}...` 
                            : mcq.statement}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {mcq.category?.name || 'Uncategorized'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(mcq.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="success">Approved</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {approvedList.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No approved MCQs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedList.map((mcq) => (
                      <TableRow key={mcq._id.toString()}>
                        <TableCell className="font-medium">
                          {mcq.statement.length > 50 
                            ? `${mcq.statement.substring(0, 50)}...` 
                            : mcq.statement}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {mcq.category?.name || 'Uncategorized'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(mcq.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <McqActionsDropdown 
                            mcqId={mcq._id.toString()} 
                            status={mcq.status} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {rejectedList.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No rejected MCQs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}