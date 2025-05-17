import  { useEffect, useState } from "react";
import { Container, CircularProgress } from "@mui/material";
import { useParams } from "react-router";
import ProjectHeader from "./ProjectHeader";
import ProjectDetails from "./ProjectDetails";
import ProjectStatus from "./ProjectStatus";

const ProjectPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    // Simulate loading project data
    const fetchData = async () => {
      setLoading(true);
      const data = {
        id,
        title: `E-commerce Platform Migration #${id}`,
        description:
          "Migration of legacy e-commerce platform to modern microservices architecture with CI/CD pipeline implementation.",
        startDate: "2023-06-15",
        endDate: "2023-12-20",
        owner: "Jane Smith",
        team: [
          { name: "Alex Johnson", role: "DevOps Engineer", avatar: "AJ", status: "active" },
          { name: "Maria Garcia", role: "Backend Developer", avatar: "MG", status: "active" },
          { name: "Sam Wilson", role: "Frontend Developer", avatar: "SW", status: "active" },
          { name: "Taylor Swift", role: "UI/UX Designer", avatar: "TS", status: "inactive" },
        ],
        technologies: ["AWS", "Kubernetes", "Docker", "Terraform", "React", "Node.js"],
        progress: 65,
        rating: 4.5,
        devOpsInfo: {
          repoUrl: "https://github.com/company/ecommerce-migration",
          ciTool: "GitHub Actions",
          deploymentTarget: "AWS EKS",
          monitoring: "Prometheus + Grafana",
          logging: "ELK Stack",
        },
      };
      setProjectData(data);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading || !projectData) {
    return (
      <Container maxWidth="xl" className="py-12 px-4 sm:px-6 lg:px-8">
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8 px-4 sm:px-6 lg:px-8">
      <ProjectHeader projectData={projectData} />
      <ProjectDetails projectData={projectData} />
      <ProjectStatus projectData={projectData} />
    </Container>
  );
};

export default ProjectPage;
