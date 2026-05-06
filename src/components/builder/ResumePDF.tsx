import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { ResumeData } from '@/store/useResumeStore'

const baseStyles = {
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 16,
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
  bold: {
    fontWeight: 'bold',
  }
} as const

const classicStyles = StyleSheet.create({
  ...baseStyles,
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    marginBottom: 4,
  },
  contact: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 10,
    color: '#4b5563',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d1d5db',
    marginBottom: 8,
    paddingBottom: 2,
  },
})

const modernStyles = StyleSheet.create({
  ...baseStyles,
  header: {
    backgroundColor: '#111827',
    padding: 30,
    margin: -40,
    marginBottom: 30,
    color: '#fff',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contact: {
    flexDirection: 'row' as const,
    gap: 15,
    fontSize: 9,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3b82f6', // Will be dynamic
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 10,
  },
})

const minimalStyles = StyleSheet.create({
  ...baseStyles,
  page: {
    ...baseStyles.page,
    padding: 50,
  },
  header: {
    marginBottom: 40,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  contact: {
    marginTop: 5,
    color: '#6b7280',
    fontSize: 9,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    color: '#9ca3af',
    marginBottom: 12,
  },
})

export function ResumePDF({ data }: { data: ResumeData }) {
  const isModern = data.template === 'modern'
  const isMinimal = data.template === 'minimal'
  const styles = isModern ? modernStyles : isMinimal ? minimalStyles : classicStyles
  
  const primaryColor = data.settings.primaryColor || '#0A84FF'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={[styles.header, isModern ? { backgroundColor: primaryColor } : {}]}>
          <Text style={styles.name}>{data.personalInfo.fullName || 'Name'}</Text>
          <View style={styles.contact}>
            <Text>{data.personalInfo.email}</Text>
            {data.personalInfo.phone && <Text>• {data.personalInfo.phone}</Text>}
            {data.personalInfo.location && <Text>• {data.personalInfo.location}</Text>}
          </View>
        </View>

        {/* Summary */}
        {data.personalInfo.summary && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isModern ? { color: primaryColor } : {}]}>Professional Summary</Text>
            <Text>{data.personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isModern ? { color: primaryColor } : {}]}>Experience</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 12 }}>
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
            <Text style={[styles.sectionTitle, isModern ? { color: primaryColor } : {}]}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 10 }}>
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
            <Text style={[styles.sectionTitle, isModern ? { color: primaryColor } : {}]}>Skills</Text>
            <Text>
              <Text style={styles.bold}>Technical Skills: </Text>
              {data.skills.join(', ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
