import DataTable from "../components/projects/DataTable";

const userColumns = [
  { id: 'name', label: 'Project Name' },
  { id: 'status', label: 'Status' },
  { id: 'progress', label: 'Progress' },
  // ... other user-specific columns
];

export default function UserProjects() {
  return (
    <DataTable 
      columns={userColumns}
      fetchUserType="user"
      title="My Projects"
    />
  );
}