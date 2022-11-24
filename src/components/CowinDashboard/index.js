// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    dataList: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getDataList()
  }

  getDataList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(covidVaccinationDataApiUrl)

    if (response.ok === true) {
      const data = await response.json()
      // console.log(data)
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(vaccination => ({
          dose1: vaccination.dose_1,
          dose2: vaccination.dose_2,
          vaccineDate: vaccination.vaccine_date,
        })),

        vaccinationByAge: data.vaccination_by_age.map(vaccinationAge => ({
          count: vaccinationAge.count,
          age: vaccinationAge.age,
        })),

        vaccinationByGender: data.vaccination_by_gender.map(
          vaccinationGender => ({
            count: vaccinationGender.count,
            gender: vaccinationGender.gender,
          }),
        ),
      }
      // console.log(updatedData)
      this.setState({
        dataList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailure = () => (
    <div className="failure-image">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="note">Something went wrong</h1>
    </div>
  )

  renderStatus = () => {
    const {dataList} = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={dataList.last7DaysVaccination}
        />

        <VaccinationByGender
          vaccinationByGenderDetails={dataList.vaccinationByGender}
        />

        <VaccinationByAge vaccinationByAgeDetails={dataList.vaccinationByAge} />
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loading-container" data-testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderStatus()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png "
            alt="website logo"
            className="website-logo"
          />
          <h1 className="title">Co-WIN</h1>
        </div>
        <h1 className="heading">CoWIN Vaccination in India</h1>
        {this.renderApiStatus()}
      </div>
    )
  }
}
export default CowinDashboard
