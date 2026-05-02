import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { ResumeData } from '@/store/useResumeStore'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  contact: {
    flexDirection: 'row',
    gap: 10,
    color: '#4b5563',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 0.5,
    borderBottomColor: '#d1d5db',
    marginBottom: 8,
    paddingBottom: 2,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  role: {
    fontWeight: 'bold',
  },
  company: {
    fontWeight: 'medium',
  },
  date: {
    color: '#4b5563',
  },
  description: {
    marginTop: 4,
    color: '#1f2937',
  },
  skills: {
    marginTop: 4,
  },
  bold: {
    fontWeight: 'bold',
  }
})

export function ResumePDF({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName || 'Name'}</Text>
          <View style={styles.contact}>
            <Text>{data.personalInfo.email}</Text>
            <Text>{data.personalInfo.phone}</Text>
            <Text>{data.personalInfo.location}</Text>
          </View>
        </View>

        {/* Summary */}
        {data.personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{data.personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 10 }}>
                <View style={styles.expHeader}>
                  <Text style={styles.role}>{exp.role}</Text>
                  <Text style={styles.date}>{exp.startDate} - {exp.endDate || 'Present'}</Text>
                </View>
                <Text style={styles.company}>{exp.company}</Text>
                <Text style={styles.description}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 8 }}>
                <View style={styles.expHeader}>
                  <Text style={styles.role}>{edu.school}</Text>
                  <Text style={styles.date}>{edu.startDate} - {edu.endDate || 'Present'}</Text>
                </View>
                <Text>{edu.degree}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skills}>
              <Text style={styles.bold}>Technical Skills: </Text>
              {data.skills.join(', ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
