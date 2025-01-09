import Prisma, { Assessment, StudentType } from "@prisma/client";
import { prisma } from "../database/prisma.database";
import { CreateAssessmentDto, UpdateDTO } from "../dtos/assessment.dto";
import { ResponseApi } from "../types";

export class AssessmentService {
  public async create(
    createAssessment: CreateAssessmentDto
  ): Promise<ResponseApi> {
    const { title, description, grade, studentId, studentLoggedId } =
      createAssessment;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return {
        ok: false,
        code: 404,
        message: "Estudante não encontrado!",
      };
    }

    if (student.type === StudentType.M) {
      if (studentLoggedId !== studentId) {
        return {
          ok: false,
          code: 404,
          message: "Não é possível criar avaliações para outros alunos!",
        };
      }
    }

    const assessmentCreated = await prisma.assessment.create({
      data: {
        title: title,
        description: description,
        grade: grade,
        studentId: studentId,
      },
    });

    return {
      ok: true,
      code: 201,
      message: "Avaliação cadastrada com sucesso!",
      data: this.mapToDto(assessmentCreated),
    };
  }

  public async findAll(
    studentId: string,
    type: StudentType,
    query?: { page?: number; take?: number }
  ): Promise<ResponseApi> {
    let where: Prisma.Prisma.AssessmentWhereInput | undefined = undefined;
    const limit = query?.take || 10;
    const page = query?.page || 1;

    const pagination = {
      take: limit,
      skip: (page - 1) * limit, // 1 - 1 = 0 * 10 = 0 || 2 - 1 = 1 * 10 = 10
    };

    // VALIDATE TYPES, FROM LIST ASSESSMENTS
    if (type !== StudentType.T) {
      where = { studentId };
    }

    const assessmentList = await prisma.assessment.findMany({
      ...pagination,
      where,
      orderBy: { createdAt: "asc" },
    });

    const count = await prisma.assessment.count({ where });

    return {
      ok: true,
      code: 200,
      message: "Avaliações buscadas com sucesso !!!",
      data: {
        assessments: assessmentList.map((ass) => this.mapToDto(ass)),
        count,
      },
    };
  }

  public async findOneById(id: string): Promise<ResponseApi> {
    const assessment = await prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      return {
        ok: false,
        code: 404,
        message: "Avaliaçao não encontrado!",
      };
    }

    return {
      ok: true,
      code: 200,
      message: "Avaliação buscada com sucesso!",
      data: assessment,
    };
  }

  public async update(
    id: string,
    updateAssessments: UpdateDTO
  ): Promise<ResponseApi> {
    const assessment = await prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      return {
        ok: false,
        code: 404,
        message: "Avaliação não encontrada!",
      };
    }

    const updateAssessment = await prisma.assessment.update({
      where: { id },
      data: { ...updateAssessments },
    });

    return {
      ok: true,
      code: 200,
      message: "Avaluação atualizada com sucesso!",
      data: this.mapToDto(updateAssessment),
    };
  }

  public async remove(id: string): Promise<ResponseApi> {
    const assessment = await prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      return {
        ok: false,
        code: 404,
        message: "Avaliação não encontrada!",
      };
    }

    const removeAssessment = await prisma.assessment.delete({
      where: { id },
    });
    return {
      ok: true,
      code: 200,
      message: "Avaliação excluída com sucesso!",
      data: this.mapToDto(removeAssessment),
    };
  }

  private mapToDto(assessment: Assessment) {
    return {
      id: assessment.id,
      title: assessment.title,
      description: assessment.description,
      grade: assessment.grade,
      createdAt: assessment.createdAt,
      studentId: assessment.studentId,
    };
  }
}
